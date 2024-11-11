import jwt from 'jsonwebtoken';

export function getUserFromToken(req) {
    // Extract the token from cookies
    const cookieHeader = req.headers.get('cookie');
    if (!cookieHeader) return null;

    const authToken = cookieHeader
        .split('; ')
        .find(row => row.startsWith('authToken='))
        ?.split('=')[1];

    if (!authToken) return null;

    try {
        // Verify the token using the secret key
        const user = jwt.verify(authToken, process.env.JWT_SECRET);
        return user; // This should contain { id, role, email, etc. }
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
}