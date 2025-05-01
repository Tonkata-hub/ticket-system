// app/api/user/route.js
import { decrypt } from "@/lib/session"
import User from "@/models/User"
import { cookies } from "next/headers"

export async function GET() {
    try {
        // Get session from cookies
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get("session")?.value
        const session = sessionCookie && (await decrypt(sessionCookie))

        if (!session?.userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get user information
        const user = await User.findByPk(session.userId, {
            attributes: ["id", "email", "role", "created_at"], // Only return safe fields
        })

        if (!user) {
            return Response.json({ error: "User not found" }, { status: 404 })
        }

        // Return user information
        return Response.json({
            id: user.id,
            email: user.email,
            role: user.role,
            createdAt: user.created_at,
        })
    } catch (error) {
        console.error("Error fetching user information:", error)
        return Response.json({ error: "Failed to fetch user information" }, { status: 500 })
    }
}
