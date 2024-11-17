import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req) {
    const token = req.cookies.get('authToken');
    const protectedPaths = ['/protected']; // Add your protected routes here

    // Check if the request is for a protected route
    if (protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
        // If there's no token, redirect to login
        if (!token) {
            return NextResponse.redirect(new URL('/', req.url));
        }

        try {
            // Verify the token; if valid, continue to the requested route
            jwt.verify(token, process.env.JWT_SECRET);
            return NextResponse.next();
        } catch (err) {
            // If the token is invalid, redirect to login
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    // Allow the request if it's not a protected route
    return NextResponse.next();
}