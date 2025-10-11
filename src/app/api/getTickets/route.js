// app/api/getTickets/route.js
import { requireAuth, handleAuthError } from "@/lib/auth";
import Ticket from "@/models/Ticket";

export async function GET() {
    try {
        const user = await requireAuth();
        const isAdmin = user.role === "admin";

        const tickets = isAdmin
            ? await Ticket.findAll()
            : await Ticket.findAll({ where: { created_by: user.email } });

        return Response.json({ tickets });
    } catch (error) {
        console.error("Error fetching tickets:", error);
        return handleAuthError(error);
    }
}