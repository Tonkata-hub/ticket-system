// /api/login
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import bcrypt from 'bcrypt';
import User from '@/models/User';

export async function POST(req) {
    const { email, password } = await req.json();

    try {
        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
        }

        // Generate JWT tokens
        const token = jwt.sign({ email, id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ email, id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Set tokens as HTTP-only cookies
        return new Response(JSON.stringify({ message: 'Logged in successfully' }), {
            status: 200,
            headers: {
                'Set-Cookie': [
                    serialize('authToken', token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        path: '/',
                        maxAge: 15 * 60,
                    }),
                    serialize('refreshToken', refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        path: '/',
                        maxAge: 7 * 24 * 60 * 60,
                    }),
                ],
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error logging in:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}