import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import { requireAuth } from "@/lib/auth";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_DIR = path.join(process.cwd(), "uploads");

// Ensure upload directory exists
async function ensureUploadDir() {
	try {
		await mkdir(UPLOAD_DIR, { recursive: true });
	} catch (error) {
		console.error("Failed to create upload directory:", error);
	}
}

export async function POST(request) {
	try {
		// 1. Authenticate user
		await requireAuth();

		// 2. Get files from form data
		const formData = await request.formData();
		const files = formData.getAll("files");

		if (!files || files.length === 0) {
			return NextResponse.json({ error: "No files provided" }, { status: 400 });
		}

		// 3. Validate file count
		if (files.length > 5) {
			return NextResponse.json({ error: "Maximum 5 files allowed" }, { status: 400 });
		}

		// 4. Ensure upload directory exists
		await ensureUploadDir();

		const uploadedFiles = [];

		// 5. Process each file
		for (const file of files) {
			// Validate file type
			if (!ALLOWED_TYPES.includes(file.type)) {
				return NextResponse.json(
					{ error: `Invalid file type: ${file.name}. Only images are allowed (PNG, JPG, JPEG, GIF, WEBP)` },
					{ status: 400 }
				);
			}

			// Validate file size
			if (file.size > MAX_FILE_SIZE) {
				return NextResponse.json(
					{ error: `File too large: ${file.name}. Maximum size is 5MB` },
					{ status: 400 }
				);
			}

			// 6. Generate unique filename
			const extension = path.extname(file.name);
			const uniqueId = nanoid(8);
			const filename = `IMG_${uniqueId.toUpperCase()}${extension}`;
			const filepath = path.join(UPLOAD_DIR, filename);

			// 7. Save file to disk
			const bytes = await file.arrayBuffer();
			const buffer = Buffer.from(bytes);
			await writeFile(filepath, buffer);

			// 8. Track uploaded file
			uploadedFiles.push(filename);
		}

		// 9. Return success with file paths
		return NextResponse.json({
			success: true,
			files: uploadedFiles,
		});
	} catch (error) {
		console.error("Error uploading file:", error);

		// Handle authentication errors
		if (error.message === "Unauthorized" || error.status === 401) {
			return NextResponse.json({ error: "Authentication required" }, { status: 401 });
		}

		return NextResponse.json({ error: "Failed to upload files" }, { status: 500 });
	}
}

