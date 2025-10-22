import { cookies } from "next/headers";
import { decrypt } from "./lib/session";
import { NextResponse } from "next/server";

const protectedRoutes = ["/tickets"];
const adminRoutes = ["/admin", "/admin/categories"]; // Add admin routes
const publicRoutes = ["/login"];

export default async function middleware(req) {
	const path = req.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.includes(path) || path.startsWith("/admin");
	const isAdminRoute = adminRoutes.includes(path) || path.startsWith("/admin");
	const isPublicRoute = publicRoutes.includes(path);

	const cookieStore = await cookies();
	const cookie = cookieStore.get("session")?.value;
	const session = await decrypt(cookie);

	// Redirect to login if trying to access protected route without being logged in
	if (isProtectedRoute && !session?.userId) {
		return NextResponse.redirect(new URL("/login", req.nextUrl));
	}

	// Redirect to tickets if trying to access admin route without admin role
	if (isAdminRoute && session?.role !== "admin") {
		return NextResponse.redirect(new URL("/tickets", req.nextUrl));
	}

	// Redirect to home if already logged in and trying to access public route
	if (isPublicRoute && session?.userId) {
		return NextResponse.redirect(new URL("/", req.nextUrl));
	}

	return NextResponse.next();
}
