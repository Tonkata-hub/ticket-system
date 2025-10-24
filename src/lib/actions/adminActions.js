"use server";

import { requireAdmin } from "@/lib/auth";
import TicketCategory from "@/models/TicketCategory";
import sequelize from "@/lib/db";

// Predefined category types
const ALLOWED_TYPES = ["issueType", "condition", "priority", "event"];

// Ensure `order` column exists at runtime (no migrations setup)
async function ensureOrderColumn() {
	const qi = sequelize.getQueryInterface();
	const table = "ticket_categories";
	const desc = await qi.describeTable(table);
	if (!desc.order) {
		// MySQL: add column if missing
		await qi.addColumn(table, "order", {
			type: "INTEGER",
			allowNull: true,
		});
	}
}

export async function getCategories() {
	try {
		// 1. Ensure order column exists and authenticate admin
		await ensureOrderColumn();
		await requireAdmin();

		// 2. Fetch all categories with proper ordering
		const categories = await TicketCategory.findAll({
			order: [
				["type", "ASC"],
				// Put rows with defined order first, then by order value, then label
				[sequelize.literal("`order` IS NULL"), "ASC"],
				["order", "ASC"],
				["label", "ASC"],
			],
		});

		return {
			success: true,
			categories,
		};
	} catch (error) {
		console.error("Error fetching categories:", error);

		// Handle authentication errors
		if (error.message === "Authentication required" || error.message === "Invalid session") {
			return {
				success: false,
				error: "Authentication required",
			};
		}

		return {
			success: false,
			error: "Failed to fetch categories. Please try again.",
		};
	}
}

export async function createCategory(categoryData) {
	try {
		// 1. Ensure order column exists and authenticate admin
		await ensureOrderColumn();
		await requireAdmin();

		// 2. Validate required fields
		if (!categoryData.type || !categoryData.value || !categoryData.label) {
			return {
				success: false,
				error: "Type, value, and label are required",
			};
		}

		// 3. Validate category type
		if (!ALLOWED_TYPES.includes(categoryData.type)) {
			return {
				success: false,
				error: `Invalid category type. Must be one of: ${ALLOWED_TYPES.join(", ")}`,
			};
		}

		// 4. Check if category with same type and value already exists
		const existingCategory = await TicketCategory.findOne({
			where: {
				type: categoryData.type,
				value: categoryData.value,
			},
		});

		if (existingCategory) {
			return {
				success: false,
				error: "A category with this type and value already exists",
			};
		}

		// 5. Determine next order within this type (null-safe)
		const maxOrder = await TicketCategory.max("order", { where: { type: categoryData.type } });
		const nextOrder = Number.isFinite(maxOrder) ? (maxOrder || 0) + 1 : 1;

		// 6. Create new category
		const newCategory = await TicketCategory.create({
			type: categoryData.type,
			value: categoryData.value,
			label: categoryData.label,
			description: categoryData.type === "priority" ? categoryData.description || null : null,
			order: nextOrder,
		});

		return {
			success: true,
			category: newCategory,
		};
	} catch (error) {
		console.error("Error creating category:", error);

		// Handle authentication errors
		if (error.message === "Authentication required" || error.message === "Invalid session") {
			return {
				success: false,
				error: "Authentication required",
			};
		}

		return {
			success: false,
			error: "Failed to create category. Please try again.",
		};
	}
}

export async function reorderCategories(type, orderedIds) {
	try {
		// 1. Ensure order column exists and authenticate admin
		await ensureOrderColumn();
		await requireAdmin();

		// 2. Validate required fields
		if (!type || !Array.isArray(orderedIds)) {
			return {
				success: false,
				error: "type and orderedIds[] are required",
			};
		}

		if (!ALLOWED_TYPES.includes(type)) {
			return {
				success: false,
				error: "Invalid category type",
			};
		}

		// 3. Ensure all ids belong to provided type
		const rows = await TicketCategory.findAll({ where: { type } });
		const idSet = new Set(rows.map((r) => r.id));
		for (const id of orderedIds) {
			if (!idSet.has(id)) {
				return {
					success: false,
					error: `Category id ${id} not in type ${type}`,
				};
			}
		}

		// 4. Apply order transactionally
		await sequelize.transaction(async (t) => {
			for (let index = 0; index < orderedIds.length; index++) {
				const id = orderedIds[index];
				await TicketCategory.update({ order: index + 1 }, { where: { id }, transaction: t });
			}
		});

		return {
			success: true,
		};
	} catch (error) {
		console.error("Error bulk reordering categories:", error);

		// Handle authentication errors
		if (error.message === "Authentication required" || error.message === "Invalid session") {
			return {
				success: false,
				error: "Authentication required",
			};
		}

		return {
			success: false,
			error: "Failed to reorder categories. Please try again.",
		};
	}
}

export async function getCategory(id) {
	try {
		// 1. Authenticate admin
		await requireAdmin();

		// 2. Find the category
		const category = await TicketCategory.findByPk(id);

		if (!category) {
			return {
				success: false,
				error: "Category not found",
			};
		}

		return {
			success: true,
			category,
		};
	} catch (error) {
		console.error("Error fetching category:", error);

		// Handle authentication errors
		if (error.message === "Authentication required" || error.message === "Invalid session") {
			return {
				success: false,
				error: "Authentication required",
			};
		}

		return {
			success: false,
			error: "Failed to fetch category. Please try again.",
		};
	}
}

export async function updateCategory(id, categoryData) {
	try {
		// 1. Authenticate admin
		await requireAdmin();

		// 2. Validate required fields
		if (!categoryData.type || !categoryData.value || !categoryData.label) {
			return {
				success: false,
				error: "Type, value, and label are required",
			};
		}

		// 3. Validate category type
		if (!ALLOWED_TYPES.includes(categoryData.type)) {
			return {
				success: false,
				error: `Invalid category type. Must be one of: ${ALLOWED_TYPES.join(", ")}`,
			};
		}

		// 4. Find the category
		const category = await TicketCategory.findByPk(id);

		if (!category) {
			return {
				success: false,
				error: "Category not found",
			};
		}

		// 5. Check if another category with same type and value already exists
		if (categoryData.type !== category.type || categoryData.value !== category.value) {
			const existingCategory = await TicketCategory.findOne({
				where: {
					type: categoryData.type,
					value: categoryData.value,
				},
			});

			if (existingCategory && existingCategory.id !== Number.parseInt(id)) {
				return {
					success: false,
					error: "Another category with this type and value already exists",
				};
			}
		}

		// 6. Update category
		await category.update({
			type: categoryData.type,
			value: categoryData.value,
			label: categoryData.label,
			description: categoryData.type === "priority" ? categoryData.description || null : null,
		});

		return {
			success: true,
			category,
		};
	} catch (error) {
		console.error("Error updating category:", error);

		// Handle authentication errors
		if (error.message === "Authentication required" || error.message === "Invalid session") {
			return {
				success: false,
				error: "Authentication required",
			};
		}

		return {
			success: false,
			error: "Failed to update category. Please try again.",
		};
	}
}

export async function deleteCategory(id) {
	try {
		// 1. Authenticate admin
		await requireAdmin();

		// 2. Find the category
		const category = await TicketCategory.findByPk(id);

		if (!category) {
			return {
				success: false,
				error: "Category not found",
			};
		}

		// 3. Delete category
		await category.destroy();

		return {
			success: true,
		};
	} catch (error) {
		console.error("Error deleting category:", error);

		// Handle authentication errors
		if (error.message === "Authentication required" || error.message === "Invalid session") {
			return {
				success: false,
				error: "Authentication required",
			};
		}

		return {
			success: false,
			error: "Failed to delete category. Please try again.",
		};
	}
}
