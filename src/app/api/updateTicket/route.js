// app/api/updateTicket/route.js
import { requireAdmin, handleAuthError } from "@/lib/auth";
import Ticket from "@/models/Ticket";

export async function PUT(request) {
	try {
		// 1. Authenticate user and verify admin role
		await requireAdmin();

		// 2. Parse request body
		const body = await request.json();

		// 3. Validate required fields
		if (!body.uid) {
			return Response.json({ error: "Ticket UID is required" }, { status: 400 });
		}

		// 4. Find the ticket
		const ticket = await Ticket.findOne({ where: { uid: body.uid } });
		if (!ticket) {
			return Response.json({ error: "Ticket not found" }, { status: 404 });
		}

		// 5. Update ticket fields
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
			communication_channel: body.communicationChannel,
			updated_at: new Date(),
		};

		// Only update fields that are provided
		Object.keys(updatableFields).forEach((key) => {
			if (updatableFields[key] === undefined) {
				delete updatableFields[key];
			}
		});

		// 6. Save the updated ticket
		await ticket.update(updatableFields);

		return Response.json({
			success: true,
			ticket: {
				uid: ticket.uid,
				status: ticket.status_badge,
				message: "Ticket updated successfully",
			},
		});
	} catch (error) {
		console.error("Error updating ticket:", error);
		return handleAuthError(error);
	}
}
