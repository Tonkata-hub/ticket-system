// /api/getTickets
import Ticket from '@/models/Ticket';
import { getUserFromToken } from '@/lib/authHelpers';

export async function GET(req) {
    const user = getUserFromToken(req);
    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
        let tickets;
        // console.log(user);
        if (user.role === 'admin') {
            // Admin can view all tickets
            tickets = await Ticket.findAll();
        } else {
            // Client can only view their own tickets
            tickets = await Ticket.findAll({ where: { user_id: user.id } });
        }

        return new Response(JSON.stringify(tickets), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching tickets:', error);
        return new Response(JSON.stringify({ message: 'Failed to fetch tickets', error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}