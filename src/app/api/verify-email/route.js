import { NextResponse } from "next/server";
import User from "@/models/User";

export async function POST(request) {
	try {
		const { userId, code } = await request.json();

		// Validate required fields
		if (!userId || !code) {
			return NextResponse.json({ error: "User ID and verification code are required" }, { status: 400 });
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

		// Check if verification code exists
		if (!user.verification_code) {
			return NextResponse.json(
				{ error: "No verification code found. Please request a new one." },
				{ status: 400 }
			);
		}

		// Check if code matches
		if (user.verification_code !== code) {
			return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
		}

		// Check if code has expired
		if (user.verification_code_expires && new Date() > new Date(user.verification_code_expires)) {
			return NextResponse.json(
				{ error: "Verification code has expired. Please request a new one." },
				{ status: 400 }
			);
		}

		// Verify the email
		await user.update({
			email_verified: true,
			verification_code: null,
			verification_code_expires: null,
			verification_code_sent_at: null,
		});

		return NextResponse.json({
			success: true,
			message: "Email verified successfully! You can now log in.",
		});
	} catch (error) {
		console.error("Email verification error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
