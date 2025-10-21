"use server";

import { z } from "zod";
import { createSession, deleteSession } from "../../lib/session";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { headers } from "next/headers";
import loginRateLimiter from "@/lib/rateLimit";

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }).trim(),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }).trim(),
});

export async function login(prevState, formData) {
    // Validate form data
    const result = loginSchema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }

    const { email, password } = result.data;

    // Get IP address for rate limiting
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";

    // Check rate limiting (5 attempts per minute per IP)
    const rateLimitCheck = loginRateLimiter.check(ip, 5, 60000);
    if (!rateLimitCheck.allowed) {
        return {
            error: "Too many login attempts. Please try again in 1 minute.",
        };
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return {
            error: "Invalid email or password",
        };
    }

    // Check if email is verified
    if (!user.email_verified) {
        return {
            error: "Please verify your email before logging in. Check your inbox for the verification code.",
        };
    }

    // Check if account is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
        const minutesRemaining = Math.ceil((new Date(user.locked_until) - new Date()) / 60000);
        return {
            error: `Account temporarily locked due to multiple failed login attempts. Please try again in ${minutesRemaining} minute${
                minutesRemaining > 1 ? "s" : ""
            }.`,
        };
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        // Increment failed login attempts
        const failedAttempts = (user.failed_login_attempts || 0) + 1;
        const now = new Date();

        // Lock account if 5 or more failed attempts
        if (failedAttempts >= 5) {
            const lockoutEnd = new Date(now.getTime() + 5 * 60000); // 5 minutes from now
            await user.update({
                failed_login_attempts: failedAttempts,
                locked_until: lockoutEnd,
                last_failed_login: now,
            });

            return {
                error: "Account temporarily locked due to multiple failed login attempts. Please try again in 5 minutes.",
            };
        } else {
            // Just increment failed attempts
            await user.update({
                failed_login_attempts: failedAttempts,
                last_failed_login: now,
            });

            return {
                error: "Invalid email or password",
            };
        }
    }

    // Successful login - reset lockout fields
    if (user.failed_login_attempts > 0 || user.locked_until || user.last_failed_login) {
        await user.update({
            failed_login_attempts: 0,
            locked_until: null,
            last_failed_login: null,
        });
    }

    // Reset rate limiter for this IP on successful login
    loginRateLimiter.reset(ip);

    await createSession(user.id, user.role);
    return { success: true };
}

export async function logout() {
    await deleteSession();
    return { success: true };
}
