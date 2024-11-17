// /api/logout
import { serialize } from 'cookie';

export async function POST() {
    return new Response(JSON.stringify({ message: 'Logged out successfully' }), {
        status: 200,
        headers: {
            'Set-Cookie': [
                serialize('authToken', '', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/',
                    expires: new Date(0),
                }),
                serialize('refreshToken', '', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/',
                    expires: new Date(0),
                }),
            ],
            'Content-Type': 'application/json',
        },
    });
}