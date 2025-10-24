"use server";

import User from "@/models/User";
import { generateVerificationCode, sendVerificationEmail } from "@/lib/email";
import { createSession } from "@/lib/session";

export async function resendVerification(userId) {
	try {
		// 1. Validate required fields
		if (!userId) {
			return {
				success: false,
				error: "User ID is required",
			};
		}

		// 2. Find user
		const user = await User.findByPk(userId);
		if (!user) {
			return {
				success: false,
				error: "User not found",
			};
		}

		// 3. Check if already verified
		if (user.email_verified) {
			return {
				success: false,
				error: "Email is already verified",
			};
		}

		// 4. Check rate limiting (1 minute minimum between resends)
		if (user.verification_code_sent_at) {
			const timeSinceLastSent = Date.now() - new Date(user.verification_code_sent_at).getTime();
			const oneMinute = 60 * 1000; // 1 minute in milliseconds

			if (timeSinceLastSent < oneMinute) {
				const remainingTime = Math.ceil((oneMinute - timeSinceLastSent) / 1000);
				return {
					success: false,
					error: `Please wait ${remainingTime} seconds before requesting a new code`,
					remainingTime,
				};
			}
		}

		// 5. Generate new verification code
		const verificationCode = generateVerificationCode();
		const codeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

		// 6. Update user with new code
		await user.update({
			verification_code: verificationCode,
			verification_code_expires: codeExpires,
			verification_code_sent_at: new Date(),
		});

		// 7. Send verification email
		const emailSent = await sendVerificationEmail(user.email, verificationCode);

		if (!emailSent) {
			console.error(`Failed to send verification email to ${user.email}`);
			return {
				success: false,
				error: "Failed to send verification email. Please try again.",
			};
		}

		return {
			success: true,
			message: "New verification code sent to your email",
		};
	} catch (error) {
		console.error("Resend verification error:", error);

		return {
			success: false,
			error: "Internal server error",
		};
	}
}

export async function verifyEmail(userId, code) {
	try {
		// 1. Validate required fields
		if (!userId || !code) {
			return {
				success: false,
				error: "User ID and verification code are required",
			};
		}

		// 2. Find user
		const user = await User.findByPk(userId);
		if (!user) {
			return {
				success: false,
				error: "User not found",
			};
		}

		// 3. Check if already verified
		if (user.email_verified) {
			return {
				success: false,
				error: "Email is already verified",
			};
		}

		// 4. Check if verification code exists
		if (!user.verification_code) {
			return {
				success: false,
				error: "No verification code found. Please request a new one.",
			};
		}

		// 5. Check if code matches
		if (user.verification_code !== code) {
			return {
				success: false,
				error: "Invalid verification code",
			};
		}

		// 6. Check if code has expired
		if (user.verification_code_expires && new Date() > new Date(user.verification_code_expires)) {
			return {
				success: false,
				error: "Verification code has expired. Please request a new one.",
			};
		}

		// 7. Verify the email
		await user.update({
			email_verified: true,
			verification_code: null,
			verification_code_expires: null,
			verification_code_sent_at: null,
		});

		// 8. Create session for the user
		await createSession(user.id, user.role);

		return {
			success: true,
			message: "Email verified successfully! You are now logged in.",
			user: {
				id: user.id,
				email: user.email,
				role: user.role,
			},
		};
	} catch (error) {
		console.error("Email verification error:", error);

		return {
			success: false,
			error: "Internal server error",
		};
	}
}
