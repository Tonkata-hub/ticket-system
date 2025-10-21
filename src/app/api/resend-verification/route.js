import { NextResponse } from "next/server";
import User from "@/models/User";
import { generateVerificationCode, sendVerificationEmail } from "@/lib/email";

export async function POST(request) {
    try {
        const { userId } = await request.json();

        // Validate required fields
        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Find user
        const user = await User.findByPk(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if already verified
        if (user.email_verified) {
            return NextResponse.json({ error: "Email is already verified" }, { status: 400 });
        }

        // Check rate limiting (1 minute minimum between resends)
        if (user.verification_code_sent_at) {
            const timeSinceLastSent = Date.now() - new Date(user.verification_code_sent_at).getTime();
            const oneMinute = 60 * 1000; // 1 minute in milliseconds

            if (timeSinceLastSent < oneMinute) {
                const remainingTime = Math.ceil((oneMinute - timeSinceLastSent) / 1000);
                return NextResponse.json(
                    {
                        error: `Please wait ${remainingTime} seconds before requesting a new code`,
                        remainingTime,
                    },
                    { status: 429 }
                );
            }
        }

        // Generate new verification code
        const verificationCode = generateVerificationCode();
        const codeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

        // Update user with new code
        await user.update({
            verification_code: verificationCode,
            verification_code_expires: codeExpires,
            verification_code_sent_at: new Date(),
        });

        // Send verification email
        const emailSent = await sendVerificationEmail(user.email, verificationCode);

        if (!emailSent) {
            console.error(`Failed to send verification email to ${user.email}`);
            return NextResponse.json(
                { error: "Failed to send verification email. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "New verification code sent to your email",
        });
    } catch (error) {
        console.error("Resend verification error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
