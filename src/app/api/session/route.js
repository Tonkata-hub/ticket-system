import { decrypt } from "@/app/lib/session";
import { cookies } from "next/headers";

export async function GET() {
    const sessionCookie = cookies().get("session")?.value;

    if (!sessionCookie) {
        return Response.json({ isLoggedIn: false }, { status: 200 });
    }

    const session = await decrypt(sessionCookie);

    return Response.json({ isLoggedIn: !!session?.userId }, { status: 200 });
}