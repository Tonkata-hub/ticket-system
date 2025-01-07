import { getUserFromToken } from '@/lib/authHelpers';

export async function GET(req) {
    const user = getUserFromToken(req);
    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    return new Response(JSON.stringify(user), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
