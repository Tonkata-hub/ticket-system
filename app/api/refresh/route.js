// /api/refresh
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

export async function POST(req) {
    try {
        const cookieHeader = req.headers.get('cookie');
        if (!cookieHeader) {
            return new Response(JSON.stringify({ error: 'No cookies found' }), { status: 401 });
        }

        const refreshToken = cookieHeader
            .split('; ')
            .find(row => row.startsWith('refreshToken='))
            ?.split('=')[1];

        if (!refreshToken) {
            return new Response(JSON.stringify({ error: 'Refresh token missing' }), { status: 401 });
        }

        // Verify the refresh token
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        } catch (error) {
            return new Response(JSON.stringify({ error: 'Invalid or expired refresh token' }), { status: 401 });
        }

        // Create a new access token
        const newAccessToken = jwt.sign(
            { id: decoded.id, email: decoded.email, role: decoded.role },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Optionally: Create a new refresh token (extend expiry)
        const newRefreshToken = jwt.sign(
            { id: decoded.id, email: decoded.email, role: decoded.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Set new cookies
        return new Response(JSON.stringify({ message: 'Token refreshed successfully' }), {
            status: 200,
            headers: {
                'Set-Cookie': [
                    serialize('authToken', newAccessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        path: '/',
                        maxAge: 15 * 60, // 15 minutes
                    }),
                    serialize('refreshToken', newRefreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        path: '/',
                        maxAge: 7 * 24 * 60 * 60, // 7 days
                    }),
                ],
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error refreshing token:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}