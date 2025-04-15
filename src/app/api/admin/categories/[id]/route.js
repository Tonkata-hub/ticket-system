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

// GET - Fetch a specific category
export async function GET(request, { params }) {
    try {
        const auth = await verifyAdminAccess()
        if (!auth.authorized) {
            return NextResponse.json({ error: auth.error }, { status: auth.status })
        }

        const category = await TicketCategory.findByPk(params.id)

        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 })
        }

        return NextResponse.json({ category })
    } catch (error) {
        console.error("Error fetching category:", error)
        return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 })
    }
}

// PUT - Update a category
export async function PUT(request, { params }) {
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

        // Find the category
        const category = await TicketCategory.findByPk(params.id)

        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 })
        }

        // Check if another category with same type and value already exists
        if (body.type !== category.type || body.value !== category.value) {
            const existingCategory = await TicketCategory.findOne({
                where: {
                    type: body.type,
                    value: body.value,
                },
            })

            if (existingCategory && existingCategory.id !== Number.parseInt(params.id)) {
                return NextResponse.json({ error: "Another category with this type and value already exists" }, { status: 409 })
            }
        }

        // Update category
        await category.update({
            type: body.type,
            value: body.value,
            label: body.label,
        })

        return NextResponse.json({ success: true, category })
    } catch (error) {
        console.error("Error updating category:", error)
        return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
    }
}

// DELETE - Delete a category
export async function DELETE(request, { params }) {
    try {
        const auth = await verifyAdminAccess()
        if (!auth.authorized) {
            return NextResponse.json({ error: auth.error }, { status: auth.status })
        }

        // Find the category
        const category = await TicketCategory.findByPk(params.id)

        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 })
        }

        // Delete category
        await category.destroy()

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting category:", error)
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
    }
}
