"use server";

import { z } from "zod";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { generateVerificationCode, sendVerificationEmail } from "@/lib/email";

const registerSchema = z
	.object({
		name: z.string().min(2, "Name must be at least 2 characters").trim(),
		email: z.string().email({ message: "Invalid email address" }).trim(),
		password: z.string().min(8, { message: "Password must be at least 8 characters" }).trim(),
		confirmPassword: z.string().trim(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export async function register(prevState, formData) {
	try {
		// Validate form data
		const result = registerSchema.safeParse(Object.fromEntries(formData));
		if (!result.success) {
			return {
				errors: result.error.flatten().fieldErrors,
			};
		}

		const { name, email, password } = result.data;

		// Check if email already exists
		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			return {
				error: "An account with this email already exists",
			};
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Generate verification code
		const verificationCode = generateVerificationCode();
		const codeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

		// Create user in database
		const user = await User.create({
			email,
			password: hashedPassword,
			role: "client",
			email_verified: false,
			verification_code: verificationCode,
			verification_code_expires: codeExpires,
			verification_code_sent_at: new Date(),
		});

		// Send verification email (console.log for testing)
		const emailSent = await sendVerificationEmail(email, verificationCode);

		if (!emailSent) {
			// If email fails, we still created the user but should log the issue
			console.error(`Failed to send verification email to ${email}`);
		}

		return {
			success: true,
			userId: user.id,
			message: "Registration successful! Please check your email for the verification code.",
		};
	} catch (error) {
		console.error("Registration error:", error);
		return {
			error: "Registration failed. Please try again.",
		};
	}
}
