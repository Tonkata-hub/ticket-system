"use server";

import { requireAuth } from "@/lib/auth";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";

export async function getUser() {
	try {
		// 1. Authenticate user
		const user = await requireAuth();

		// 2. Return user information
		return {
			success: true,
			user: {
				id: user.id,
				email: user.email,
				role: user.role,
				createdAt: user.created_at,
			},
		};
	} catch (error) {
		console.error("Error fetching user information:", error);

		// Handle authentication errors
		if (error.message === "Authentication required" || error.message === "Invalid session") {
			return {
				success: false,
				error: "Authentication required",
			};
		}

		return {
			success: false,
			error: "Failed to fetch user information. Please try again.",
		};
	}
}

export async function getSession() {
	try {
		// 1. Get session cookie
		const cookieStore = await cookies();
		const sessionCookie = cookieStore.get("session")?.value;

		if (!sessionCookie) {
			return {
				success: true,
				session: {
					isLoggedIn: false,
					role: "client",
				},
			};
		}

		// 2. Decrypt session
		const session = await decrypt(sessionCookie);

		return {
			success: true,
			session: {
				isLoggedIn: !!session?.userId,
				role: session?.role || "client",
			},
		};
	} catch (error) {
		console.error("Error checking session:", error);

		return {
			success: false,
			error: "Failed to check session status. Please try again.",
		};
	}
}
