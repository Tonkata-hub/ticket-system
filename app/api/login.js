import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import User from '@/models/User';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        try {
            // Find the user by email
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Directly compare the plain-text passwords
            if (password !== user.password) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate JWT tokens
            const token = jwt.sign({ email, id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
            const refreshToken = jwt.sign({ email, id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

            // Set tokens as HTTP-only cookies
            res.setHeader('Set-Cookie', [
                serialize('authToken', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/',
                    maxAge: 15 * 60 // 15 minutes
                }),
                serialize('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/',
                    maxAge: 7 * 24 * 60 * 60 // 7 days
                })
            ]);

            return res.status(200).json({ message: 'Logged in successfully' });
        } catch (error) {
            console.error('Error logging in:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}