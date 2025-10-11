// app/api/createTicket/route.js
import { requireAuth, handleAuthError } from "@/lib/auth"
import Ticket from "@/models/Ticket"
import { nanoid } from "nanoid"

export async function POST(request) {
    try {
        // 1. Authenticate user
        const user = await requireAuth()

        // 2. Parse request body
        const body = await request.json()

        // 3. Validate required fields - removed clientNote from required fields
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

        // 4. Generate a random ticket ID using nanoid
        const ticketId = `T-${nanoid(8).toUpperCase()}`

        // 5. Create ticket with random ID
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
        return handleAuthError(error)
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

