// app/api/getTickets/route.js
import { decrypt } from "@/lib/session";
import Ticket from "@/models/Ticket";
import { cookies } from "next/headers";
import User from "@/models/User";

export async function GET() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    const session = sessionCookie && await decrypt(sessionCookie);

    if (!session?.userId) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findByPk(session.userId);
    const isAdmin = user?.role === "admin";

    const tickets = isAdmin
        ? await Ticket.findAll()
        : await Ticket.findAll({ where: { created_by: user.email } });

    return Response.json({ tickets });
}