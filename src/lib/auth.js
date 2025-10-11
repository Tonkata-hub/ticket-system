// /src/lib/auth.js
import "server-only";
import { cookies } from "next/headers";
import { decrypt } from "./session";
import User from "@/models/User";

/**
 * Get the current user from session cookie
 * @returns {Promise<User|null>} User object or null if not authenticated
 */
export async function getCurrentUser() {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("session")?.value;

        if (!sessionCookie) {
            return null;
        }

        const session = await decrypt(sessionCookie);

        if (!session?.userId) {
            return null;
        }

        const user = await User.findByPk(session.userId, {
            attributes: ["id", "email", "role", "created_at", "updated_at"],
        });

        return user;
    } catch (error) {
        console.error("Error getting current user:", error);
        return null;
    }
}

/**
 * Get the current session data
 * @returns {Promise<{userId: number, role: string}|null>} Session payload or null
 */
export async function getSession() {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("session")?.value;

        if (!sessionCookie) {
            return null;
        }

        const session = await decrypt(sessionCookie);
        return session || null;
    } catch (error) {
        console.error("Error getting session:", error);
        return null;
    }
}

/**
 * Require authentication - throws error if not authenticated
 * @returns {Promise<User>} User object
 * @throws {AuthError} If user is not authenticated
 */
export async function requireAuth() {
    const user = await getCurrentUser();

    if (!user) {
        const error = new Error("Unauthorized");
        error.status = 401;
        throw error;
    }

    return user;
}

/**
 * Require admin role - throws error if not admin
 * @returns {Promise<User>} User object with admin role
 * @throws {AuthError} If user is not authenticated or not admin
 */
export async function requireAdmin() {
    const user = await requireAuth();

    if (user.role !== "admin") {
        const error = new Error("Forbidden: Admin access required");
        error.status = 403;
        throw error;
    }

    return user;
}

/**
 * Check if current user is admin
 * @returns {Promise<boolean>} True if user is admin, false otherwise
 */
export async function isAdmin() {
    const user = await getCurrentUser();
    return user?.role === "admin";
}

/**
 * Check if current user owns a resource
 * @param {string} resourceOwnerEmail - Email of the resource owner
 * @returns {Promise<boolean>} True if current user owns the resource
 */
export async function ownsResource(resourceOwnerEmail) {
    const user = await getCurrentUser();
    return user?.email === resourceOwnerEmail;
}

/**
 * Require resource ownership or admin role
 * @param {string} resourceOwnerEmail - Email of the resource owner
 * @returns {Promise<User>} User object
 * @throws {AuthError} If user doesn't own resource and is not admin
 */
export async function requireOwnershipOrAdmin(resourceOwnerEmail) {
    const user = await requireAuth();

    const isOwner = user.email === resourceOwnerEmail;
    const isUserAdmin = user.role === "admin";

    if (!isOwner && !isUserAdmin) {
        const error = new Error("Forbidden: You don't have permission to access this resource");
        error.status = 403;
        throw error;
    }

    return user;
}

/**
 * Handle auth errors in API routes
 * @param {Error} error - The error object
 * @returns {Response} JSON response with appropriate status code
 */
export function handleAuthError(error) {
    const status = error.status || 500;
    const message = status === 500 ? "Internal server error" : error.message;

    return Response.json({ error: message }, { status });
}

