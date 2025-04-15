import { NextResponse } from "next/server";
const TicketCategory = require("@/models/TicketCategory");

export async function GET() {
    try {
        const records = await TicketCategory.findAll();

        const grouped = records.reduce((acc, item) => {
            acc[item.type] = acc[item.type] || [];
            acc[item.type].push({ value: item.value, text: item.label });
            return acc;
        }, {});

        return NextResponse.json(grouped);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to load options" }, { status: 500 });
    }
}