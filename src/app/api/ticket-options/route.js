import { NextResponse } from "next/server";
const TicketCategory = require("@/models/TicketCategory");
import sequelize from "@/lib/db";

// Ensure `order` column exists at runtime (no migrations setup)
async function ensureOrderColumn() {
    const qi = sequelize.getQueryInterface();
    const table = "ticket_categories";
    const desc = await qi.describeTable(table);
    if (!desc.order) {
        await qi.addColumn(table, "order", {
            type: "INTEGER",
            allowNull: true,
        });
    }
}

export async function GET() {
    try {
        await ensureOrderColumn();
        const records = await TicketCategory.findAll({
            order: [
                ["type", "ASC"],
                [sequelize.literal("`order` IS NULL"), "ASC"],
                ["order", "ASC"],
                ["label", "ASC"],
            ],
        });

        const grouped = records.reduce((acc, item) => {
            acc[item.type] = acc[item.type] || [];
            acc[item.type].push({
                value: item.value,
                text: item.label,
                description: item.description || "",
            });
            return acc;
        }, {});

        return NextResponse.json(grouped);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to load options" }, { status: 500 });
    }
}