// app/api/admin/categories/route.js
import { NextResponse } from "next/server"
import { decrypt } from "@/lib/session"
import { cookies } from "next/headers"
import User from "@/models/User"
import TicketCategory from "@/models/TicketCategory"

// Predefined category types
const ALLOWED_TYPES = ["issueType", "condition", "priority", "event"]

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
        const auth = await verifyAdminAccess()
        if (!auth.authorized) {
            return NextResponse.json({ error: auth.error }, { status: auth.status })
        }

        const categories = await TicketCategory.findAll({
            order: [
                ["type", "ASC"],
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

        // Create new category
        const newCategory = await TicketCategory.create({
            type: body.type,
            value: body.value,
            label: body.label,
            description: body.type === "priority" ? body.description || null : null,
        })

        return NextResponse.json({ success: true, category: newCategory }, { status: 201 })
    } catch (error) {
        console.error("Error creating category:", error)
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
    }
}
