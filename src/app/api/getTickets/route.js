// app/api/getTickets/route.js
import Ticket from "@/models/Ticket";

export async function GET() {
    try {
        const tickets = await Ticket.findAll();
        console.log(tickets);
        return Response.json({ tickets });
    } catch (error) {
        return Response.json({ error: "Failed to fetch tickets" }, { status: 500 });
    }
}