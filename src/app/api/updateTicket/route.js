import { decrypt } from "@/lib/session"
import Ticket from "@/models/Ticket"
import User from "@/models/User"
import { cookies } from "next/headers"

export async function PUT(request) {
    try {
        // 1. Authenticate user and verify admin role
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get("session")?.value
        const session = sessionCookie && (await decrypt(sessionCookie))

        if (!session?.userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
        }

        // 2. Verify user is an admin
        const user = await User.findByPk(session.userId)
        if (!user || user.role !== "admin") {
            return Response.json({ error: "Forbidden: Admin access required" }, { status: 403 })
        }

        // 3. Parse request body
        const body = await request.json()

        // 4. Validate required fields
        if (!body.uid) {
            return Response.json({ error: "Ticket UID is required" }, { status: 400 })
        }

        // 5. Find the ticket
        const ticket = await Ticket.findOne({ where: { uid: body.uid } })
        if (!ticket) {
            return Response.json({ error: "Ticket not found" }, { status: 404 })
        }

        // 6. Update ticket fields
        const updatableFields = {
            issue_type: body.issueType,
            current_condition: body.currentCondition,
            priority: body.priority,
            status_badge: body.statusBadge,
            selected_event: body.selectedEvent,
            client_note: body.clientNote,
            assignee: body.assignee,
            current_condition_admin: body.currentConditionByAdmin,
            problem_solved_at: body.problemSolvedAt,
            action_taken: body.actionTaken,
            time_taken_to_solve: body.timeTakenToSolve,
            related_tickets: body.relatedTickets || "",
            comments: body.comments ? JSON.stringify(body.comments) : ticket.comments,
            updated_at: new Date(),
        }

        // Only update fields that are provided
        Object.keys(updatableFields).forEach((key) => {
            if (updatableFields[key] === undefined) {
                delete updatableFields[key]
            }
        })

        // 7. Save the updated ticket
        await ticket.update(updatableFields)

        return Response.json({
            success: true,
            ticket: {
                uid: ticket.uid,
                status: ticket.status_badge,
                message: "Ticket updated successfully",
            },
        })
    } catch (error) {
        console.error("Error updating ticket:", error)
        return Response.json(
            {
                error: "Failed to update ticket",
                details: error.message,
            },
            { status: 500 },
        )
    }
}
