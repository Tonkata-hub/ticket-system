import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        // Authenticate user (mock check; replace with actual authentication)
        if (email === 'admin@gmail.com' && password === 'test123123') {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' }); // Short-lived token
            const refreshToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' }); // Longer refresh token

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
        } else {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}