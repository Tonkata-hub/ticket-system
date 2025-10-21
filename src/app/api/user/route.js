// app/api/user/route.js
import { requireAuth, handleAuthError } from "@/lib/auth";

export async function GET() {
	try {
		const user = await requireAuth();

		// Return user information
		return Response.json({
			id: user.id,
			email: user.email,
			role: user.role,
			createdAt: user.created_at,
		});
	} catch (error) {
		console.error("Error fetching user information:", error);
		return handleAuthError(error);
	}
}
