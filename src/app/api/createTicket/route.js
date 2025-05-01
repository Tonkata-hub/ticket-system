// app/api/createTicket/route.js
import { decrypt } from "@/lib/session"
import Ticket from "@/models/Ticket"
import User from "@/models/User"
import { cookies } from "next/headers"
import { nanoid } from "nanoid"

export async function POST(request) {
    try {
        // 1. Authenticate user
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get("session")?.value
        const session = sessionCookie && (await decrypt(sessionCookie))

        if (!session?.userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
        }

        // 2. Get user information
        const user = await User.findByPk(session.userId)
        if (!user) {
            return Response.json({ error: "User not found" }, { status: 404 })
        }

        // 3. Parse request body
        const body = await request.json()

        // 4. Validate required fields - removed clientNote from required fields
        const requiredFields = ["priority", "shortDescription"]
        const missingFields = requiredFields.filter((field) => !body[field])

        if (missingFields.length > 0) {
            return Response.json(
                {
                    error: "Missing required fields",
                    fields: missingFields,
                },
                { status: 400 },
            )
        }

        // 5. Generate a random ticket ID using nanoid
        const ticketId = `T-${nanoid(8).toUpperCase()}`

        // 6. Create ticket with random ID
        const ticket = await Ticket.create({
            uid: ticketId,
            created_by: user.email,
            created_at: new Date(),
            issue_type: body.issueType,
            current_condition: body.condition,
            priority: mapPriorityToDatabase(body.priority),
            status_badge: "Open",
            selected_event: body.event,
            client_note: body.shortDescription,
            communication_channel: body.communicationChannel || null,
            updated_at: new Date(),
            comments: JSON.stringify([]),
        })

        return Response.json(
            {
                success: true,
                ticket: {
                    uid: ticket.uid,
                    status: ticket.status_badge,
                },
            },
            { status: 201 },
        )
    } catch (error) {
        console.error("Error creating ticket:", error)
        return Response.json(
            {
                error: "Failed to create ticket",
                details: error.message,
            },
            { status: 500 },
        )
    }
}

// Helper function to map priority values from the form to database values
function mapPriorityToDatabase(priority) {
    const priorityMap = {
        urgent: "High",
        standard: "Medium",
        "low-priority": "Low",
    }

    return priorityMap[priority] || "Medium"
}

