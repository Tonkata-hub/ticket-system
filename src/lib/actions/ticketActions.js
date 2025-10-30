"use server";

import { requireAuth, handleAuthError } from "@/lib/auth";
import Ticket from "@/models/Ticket";
import TicketCategory from "@/models/TicketCategory";
import sequelize from "@/lib/db";
import { nanoid } from "nanoid";
import { sendNewTicketEmail } from "@/lib/email";

// Helper function to map priority values from the form to database values
function mapPriorityToDatabase(priority) {
	const priorityMap = {
		urgent: "High",
		standard: "Medium",
		"low-priority": "Low",
	};

	return priorityMap[priority] || "Medium";
}

// Helper function to transform ticket data for client consumption
function transformTicketData(tickets) {
	return tickets.map((t) => ({
		...t,
		uid: t.uid,
		createdAt: t.created_at,
		createdBy: t.created_by,
		issueType: t.issue_type,
		currentCondition: t.current_condition,
		priority: t.priority,
		statusBadge: t.status_badge,
		selectedEvent: t.selected_event,
		clientNote: t.client_note,
		dateOfStartingWork: t.date_of_starting_work,
		assignee: t.assignee,
		currentConditionByAdmin: t.current_condition_admin,
		problemSolvedAt: t.problem_solved_at,
		actionTaken: t.action_taken,
		timeTakenToSolve: t.time_taken_to_solve,
		relatedTickets: t.related_tickets ? t.related_tickets.split(",") : [],
		attachments: t.attachments ? t.attachments.split(",") : [],
		comments: t.comments ? JSON.parse(t.comments) : [],
		communicationChannel: t.communication_channel,
		updatedAt: t.updated_at,
	}));
}

export async function createTicket(ticketData) {
	try {
		// 1. Authenticate user
		const user = await requireAuth();

		// 2. Validate required fields
		const requiredFields = ["priority", "shortDescription"];
		const missingFields = requiredFields.filter((field) => !ticketData[field]);

		if (missingFields.length > 0) {
			return {
				success: false,
				error: "Missing required fields",
				fields: missingFields,
			};
		}

		// 3. Generate a random ticket ID using nanoid
		const ticketId = `T-${nanoid(8).toUpperCase()}`;

		// 4. Create ticket with random ID
		const ticket = await Ticket.create({
			uid: ticketId,
			created_by: user.email,
			created_at: new Date(),
			issue_type: ticketData.issueType,
			current_condition: ticketData.condition,
			priority: mapPriorityToDatabase(ticketData.priority),
			status_badge: "Open",
			selected_event: ticketData.event,
			client_note: ticketData.shortDescription,
			communication_channel: ticketData.communicationChannel || null,
			updated_at: new Date(),
			comments: JSON.stringify([]),
		});

		// 5. Send notification emails (non-blocking)
		const minimal = { id: ticket.uid, title: ticket.client_note || ticket.issue_type || "New Ticket" };
		const emailResults = await Promise.allSettled([
			sendNewTicketEmail(user.email, minimal),
			sendNewTicketEmail("niki@stil2000.com", minimal),
		]);
		emailResults.forEach((res, idx) => {
			if (res.status === "rejected") {
				console.error(`New ticket email ${idx + 1} failed:`, res.reason);
			}
		});

		return {
			success: true,
			ticket: {
				uid: ticket.uid,
				status: ticket.status_badge,
			},
		};
	} catch (error) {
		console.error("Error creating ticket:", error);

		// Handle authentication errors
		if (error.message === "Authentication required" || error.message === "Invalid session") {
			return {
				success: false,
				error: "Authentication required",
			};
		}

		return {
			success: false,
			error: "Failed to create ticket. Please try again.",
		};
	}
}

export async function getTickets() {
	try {
		// 1. Authenticate user
		const user = await requireAuth();
		const isAdmin = user.role === "admin";

		// 2. Fetch tickets based on user role
		const tickets = isAdmin ? await Ticket.findAll() : await Ticket.findAll({ where: { created_by: user.email } });

		// 3. Transform ticket data for client consumption
		const transformedTickets = transformTicketData(tickets);

		return {
			success: true,
			tickets: transformedTickets,
		};
	} catch (error) {
		console.error("Error fetching tickets:", error);

		// Handle authentication errors
		if (error.message === "Authentication required" || error.message === "Invalid session") {
			return {
				success: false,
				error: "Authentication required",
			};
		}

		return {
			success: false,
			error: "Failed to fetch tickets. Please try again.",
		};
	}
}

export async function updateTicket(ticketData) {
	try {
		// 1. Authenticate user and verify admin role
		const user = await requireAuth();
		if (user.role !== "admin") {
			return {
				success: false,
				error: "Admin access required",
			};
		}

		// 2. Validate required fields
		if (!ticketData.uid) {
			return {
				success: false,
				error: "Ticket UID is required",
			};
		}

		// 3. Find the ticket
		const ticket = await Ticket.findOne({ where: { uid: ticketData.uid } });
		if (!ticket) {
			return {
				success: false,
				error: "Ticket not found",
			};
		}

		// 4. Update ticket fields
		const updatableFields = {
			issue_type: ticketData.issueType,
			current_condition: ticketData.currentCondition,
			priority: ticketData.priority,
			status_badge: ticketData.statusBadge,
			selected_event: ticketData.selectedEvent,
			client_note: ticketData.clientNote,
			assignee: ticketData.assignee,
			current_condition_admin: ticketData.currentConditionByAdmin,
			problem_solved_at: ticketData.problemSolvedAt,
			action_taken: ticketData.actionTaken,
			time_taken_to_solve: ticketData.timeTakenToSolve,
			related_tickets: ticketData.relatedTickets || "",
			comments: ticketData.comments ? JSON.stringify(ticketData.comments) : ticket.comments,
			communication_channel: ticketData.communicationChannel,
			updated_at: new Date(),
		};

		// Only update fields that are provided
		Object.keys(updatableFields).forEach((key) => {
			if (updatableFields[key] === undefined) {
				delete updatableFields[key];
			}
		});

		// 5. Save the updated ticket
		await ticket.update(updatableFields);

		return {
			success: true,
			ticket: {
				uid: ticket.uid,
				status: ticket.status_badge,
				message: "Ticket updated successfully",
			},
		};
	} catch (error) {
		console.error("Error updating ticket:", error);

		// Handle authentication errors
		if (error.message === "Authentication required" || error.message === "Invalid session") {
			return {
				success: false,
				error: "Authentication required",
			};
		}

		return {
			success: false,
			error: "Failed to update ticket. Please try again.",
		};
	}
}

// Ensure `order` column exists at runtime (no migrations setup)
async function ensureOrderColumn() {
	const qi = sequelize.getQueryInterface();
	const table = "ticket_categories";
	const desc = await qi.describeTable(table);
	if (!desc.order) {
		await qi.addColumn(table, "order", {
			type: "INTEGER",
			allowNull: true,
		});
	}
}

export async function getTicketOptions() {
	try {
		// 1. Ensure order column exists
		await ensureOrderColumn();

		// 2. Fetch all categories
		const records = await TicketCategory.findAll({
			order: [
				["type", "ASC"],
				[sequelize.literal("`order` IS NULL"), "ASC"],
				["order", "ASC"],
				["label", "ASC"],
			],
		});

		// 3. Group categories by type
		const grouped = records.reduce((acc, item) => {
			acc[item.type] = acc[item.type] || [];
			acc[item.type].push({
				value: item.value,
				text: item.label,
				description: item.description || "",
			});
			return acc;
		}, {});

		return {
			success: true,
			options: grouped,
		};
	} catch (error) {
		console.error("Error fetching ticket options:", error);

		return {
			success: false,
			error: "Failed to load ticket options. Please try again.",
		};
	}
}
