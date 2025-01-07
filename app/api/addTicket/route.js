// /api/addTicket
import Ticket from '@/models/Ticket';

export async function POST(req) {
    try {
        const body = await req.json();

        // Validate input
        if (!body.issueType || !body.condition || !body.priority || !body.event) {
            return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
        }

        // Add the new ticket to the database
        const newTicket = await Ticket.create({
            author: body.author || 'Anonymous',
            authorId: body.authorId || 0,
            queryType: body.issueType, // Save the text label for issueType
            queryDesc: body.otherIssue || null,
            status: body.condition, // Save the text label for condition
            statusDesc: body.otherCondition || null,
            priority: body.priority, // Save the text label for priority
            category: body.event, // Save the text label for event
        });

        return new Response(JSON.stringify(newTicket), { status: 201 });
    } catch (error) {
        console.error('Error creating ticket:', error);
        return new Response(JSON.stringify({ error: 'Failed to create ticket', details: error.message }), { status: 500 });
    }
}
