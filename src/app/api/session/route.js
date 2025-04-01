// /src/app/api/session/route.js
import { decrypt } from "@/app/lib/session";
import { cookies } from "next/headers";

export async function GET() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
        return Response.json({ isLoggedIn: false }, { status: 200 });
    }

    const session = await decrypt(sessionCookie);

    return Response.json({ isLoggedIn: !!session?.userId }, { status: 200 });
}