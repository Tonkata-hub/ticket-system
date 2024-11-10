import User from '@/models/User';

export async function GET(req) {
    try {
        const users = await User.findAll();
        return new Response(JSON.stringify(users), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return new Response(JSON.stringify({ message: 'Failed to fetch users', error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}