import { NextResponse } from "next/server";

export async function POST(request) {
	try {
		const { locale } = await request.json();
		if (!locale || !["en", "bg"].includes(locale)) {
			return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
		}
		const res = NextResponse.json({ success: true });
		res.cookies.set("locale", locale, { path: "/", httpOnly: false, sameSite: "lax", maxAge: 60 * 60 * 24 * 365 });
		return res;
	} catch (e) {
		return NextResponse.json({ error: "Bad request" }, { status: 400 });
	}
}
