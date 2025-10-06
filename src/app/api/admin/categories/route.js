// app/api/admin/categories/route.js
import { NextResponse } from "next/server"
import { decrypt } from "@/lib/session"
import { cookies } from "next/headers"
import User from "@/models/User"
import TicketCategory from "@/models/TicketCategory"
import sequelize from "@/lib/db"

// Predefined category types
const ALLOWED_TYPES = ["issueType", "condition", "priority", "event"]

// Ensure `order` column exists at runtime (no migrations setup)
async function ensureOrderColumn() {
    const qi = sequelize.getQueryInterface()
    const table = "ticket_categories"
    const desc = await qi.describeTable(table)
    if (!desc.order) {
        // MySQL: add column if missing
        await qi.addColumn(table, "order", {
            type: "INTEGER",
            allowNull: true,
        })
    }
}

// Helper function to verify admin access
async function verifyAdminAccess() {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")?.value
    const session = sessionCookie && (await decrypt(sessionCookie))

    if (!session?.userId) {
        return { authorized: false, error: "Unauthorized", status: 401 }
    }

    const user = await User.findByPk(session.userId)
    if (!user || user.role !== "admin") {
        return { authorized: false, error: "Forbidden: Admin access required", status: 403 }
    }

    return { authorized: true, user }
}

// GET - Fetch all categories
export async function GET() {
    try {
        await ensureOrderColumn()
        const auth = await verifyAdminAccess()
        if (!auth.authorized) {
            return NextResponse.json({ error: auth.error }, { status: auth.status })
        }

        const categories = await TicketCategory.findAll({
            order: [
                ["type", "ASC"],
                // Put rows with defined order first, then by order value, then label
                [sequelize.literal("`order` IS NULL"), "ASC"],
                ["order", "ASC"],
                ["label", "ASC"],
            ],
        })

        return NextResponse.json({ categories })
    } catch (error) {
        console.error("Error fetching categories:", error)
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
    }
}

// POST - Create a new category
export async function POST(request) {
    try {
        await ensureOrderColumn()
        const auth = await verifyAdminAccess()
        if (!auth.authorized) {
            return NextResponse.json({ error: auth.error }, { status: auth.status })
        }

        const body = await request.json()

        // Validate required fields
        if (!body.type || !body.value || !body.label) {
            return NextResponse.json({ error: "Type, value, and label are required" }, { status: 400 })
        }

        // Validate category type
        if (!ALLOWED_TYPES.includes(body.type)) {
            return NextResponse.json(
                { error: `Invalid category type. Must be one of: ${ALLOWED_TYPES.join(", ")}` },
                { status: 400 },
            )
        }

        // Check if category with same type and value already exists
        const existingCategory = await TicketCategory.findOne({
            where: {
                type: body.type,
                value: body.value,
            },
        })

        if (existingCategory) {
            return NextResponse.json({ error: "A category with this type and value already exists" }, { status: 409 })
        }

        // Determine next order within this type (null-safe)
        const maxOrder = await TicketCategory.max("order", { where: { type: body.type } })
        const nextOrder = Number.isFinite(maxOrder) ? (maxOrder || 0) + 1 : 1

        // Create new category
        const newCategory = await TicketCategory.create({
            type: body.type,
            value: body.value,
            label: body.label,
            description: body.type === "priority" ? body.description || null : null,
            order: nextOrder,
        })

        return NextResponse.json({ success: true, category: newCategory }, { status: 201 })
    } catch (error) {
        console.error("Error creating category:", error)
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
    }
}

// PUT - Bulk reorder categories within a type
export async function PUT(request) {
    try {
        await ensureOrderColumn()
        const auth = await verifyAdminAccess()
        if (!auth.authorized) {
            return NextResponse.json({ error: auth.error }, { status: auth.status })
        }

        const body = await request.json()
        const { type, orderedIds } = body || {}
        if (!type || !Array.isArray(orderedIds)) {
            return NextResponse.json({ error: "type and orderedIds[] are required" }, { status: 400 })
        }
        if (!ALLOWED_TYPES.includes(type)) {
            return NextResponse.json({ error: `Invalid category type` }, { status: 400 })
        }

        // Ensure all ids belong to provided type
        const rows = await TicketCategory.findAll({ where: { type } })
        const idSet = new Set(rows.map(r => r.id))
        for (const id of orderedIds) {
            if (!idSet.has(id)) {
                return NextResponse.json({ error: `Category id ${id} not in type ${type}` }, { status: 400 })
            }
        }

        // Apply order transactionally
        await sequelize.transaction(async (t) => {
            for (let index = 0; index < orderedIds.length; index++) {
                const id = orderedIds[index]
                await TicketCategory.update({ order: index + 1 }, { where: { id }, transaction: t })
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error bulk reordering categories:", error)
        return NextResponse.json({ error: "Failed to reorder categories" }, { status: 500 })
    }
}
