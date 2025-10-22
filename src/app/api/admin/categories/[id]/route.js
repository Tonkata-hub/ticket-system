// app/api/admin/categories/[id]/route.js
import { NextResponse } from "next/server";
import { requireAdmin, handleAuthError } from "@/lib/auth";
import TicketCategory from "@/models/TicketCategory";

// Predefined category types
const ALLOWED_TYPES = ["issueType", "condition", "priority", "event"];

// GET - Fetch a specific category
export async function GET(request, { params }) {
	try {
		await requireAdmin();

		const category = await TicketCategory.findByPk(params.id);

		if (!category) {
			return NextResponse.json({ error: "Category not found" }, { status: 404 });
		}

		return NextResponse.json({ category });
	} catch (error) {
		console.error("Error fetching category:", error);
		return handleAuthError(error);
	}
}

// PUT - Update a category
export async function PUT(request, { params }) {
	try {
		await requireAdmin();

		const body = await request.json();

		// Validate required fields
		if (!body.type || !body.value || !body.label) {
			return NextResponse.json({ error: "Type, value, and label are required" }, { status: 400 });
		}

		// Validate category type
		if (!ALLOWED_TYPES.includes(body.type)) {
			return NextResponse.json(
				{ error: `Invalid category type. Must be one of: ${ALLOWED_TYPES.join(", ")}` },
				{ status: 400 }
			);
		}

		// Find the category
		const category = await TicketCategory.findByPk(params.id);

		if (!category) {
			return NextResponse.json({ error: "Category not found" }, { status: 404 });
		}

		// Check if another category with same type and value already exists
		if (body.type !== category.type || body.value !== category.value) {
			const existingCategory = await TicketCategory.findOne({
				where: {
					type: body.type,
					value: body.value,
				},
			});

			if (existingCategory && existingCategory.id !== Number.parseInt(params.id)) {
				return NextResponse.json(
					{ error: "Another category with this type and value already exists" },
					{ status: 409 }
				);
			}
		}

		// Update category
		await category.update({
			type: body.type,
			value: body.value,
			label: body.label,
			description: body.type === "priority" ? body.description || null : null,
		});

		return NextResponse.json({ success: true, category });
	} catch (error) {
		console.error("Error updating category:", error);
		return handleAuthError(error);
	}
}

// DELETE - Delete a category
export async function DELETE(request, { params }) {
	try {
		await requireAdmin();

		// Find the category
		const category = await TicketCategory.findByPk(params.id);

		if (!category) {
			return NextResponse.json({ error: "Category not found" }, { status: 404 });
		}

		// Delete category
		await category.destroy();

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting category:", error);
		return handleAuthError(error);
	}
}
