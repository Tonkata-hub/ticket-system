import { cookies } from "next/headers";
import { decrypt } from "./lib/session";
import { NextResponse } from "next/server";

const protectedRoutes = ["/tickets"];
const publicRoutes = ["/login"];

export default async function middleware(req) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    const cookieStore = await cookies();
    const cookie = cookieStore.get("session")?.value;
    const session = await decrypt(cookie);

    if (isProtectedRoute && !session?.userId) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    if (isPublicRoute && session?.userId) {
        return NextResponse.redirect(new URL("/tickets", req.nextUrl));
    }

    return NextResponse.next();
};