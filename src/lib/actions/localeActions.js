"use server";

import { cookies } from "next/headers";

export async function setLocale(locale) {
	try {
		// 1. Validate locale
		if (!locale || !["en", "bg"].includes(locale)) {
			return {
				success: false,
				error: "Invalid locale",
			};
		}

		// 2. Set locale cookie
		const cookieStore = await cookies();
		cookieStore.set("locale", locale, {
			path: "/",
			httpOnly: false,
			sameSite: "lax",
			maxAge: 60 * 60 * 24 * 365,
		});

		return {
			success: true,
			message: "Locale set successfully",
		};
	} catch (error) {
		console.error("Error setting locale:", error);

		return {
			success: false,
			error: "Failed to set locale. Please try again.",
		};
	}
}
