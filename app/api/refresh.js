export default async function handler(req, res) {
    const refreshToken = req.cookies.get('refreshToken');

    if (!refreshToken) {
        return res.status(401).json({ error: 'No refresh token' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const newToken = jwt.sign({ email: decoded.email }, process.env.JWT_SECRET, { expiresIn: '15m' });

        res.setHeader('Set-Cookie', serialize('authToken', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 15 * 60 // 15 minutes
        }));

        return res.status(200).json({ message: 'Token refreshed' });
    } catch (err) {
        return res.status(403).json({ error: 'Invalid refresh token' });
    }
}