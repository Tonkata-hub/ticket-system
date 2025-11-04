import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export async function GET(request, { params }) {
	try {
		const filename = (await params).filename.join("/");
		const filepath = path.join(UPLOAD_DIR, filename);

		// Security check: ensure file is within uploads directory
		const resolvedPath = path.resolve(filepath);
		const resolvedUploadDir = path.resolve(UPLOAD_DIR);

		if (!resolvedPath.startsWith(resolvedUploadDir)) {
			return NextResponse.json({ error: "Invalid file path" }, { status: 403 });
		}

		// Check if file exists
		if (!existsSync(filepath)) {
			return NextResponse.json({ error: "File not found" }, { status: 404 });
		}

		// Read file
		const fileBuffer = await readFile(filepath);

		// Determine content type based on file extension
		const ext = path.extname(filename).toLowerCase();
		const contentTypes = {
			".png": "image/png",
			".jpg": "image/jpeg",
			".jpeg": "image/jpeg",
			".gif": "image/gif",
			".webp": "image/webp",
		};
		const contentType = contentTypes[ext] || "application/octet-stream";

		// Return file with appropriate headers
		return new NextResponse(fileBuffer, {
			headers: {
				"Content-Type": contentType,
				"Cache-Control": "public, max-age=31536000, immutable",
			},
		});
	} catch (error) {
		console.error("Error serving file:", error);
		return NextResponse.json({ error: "Failed to serve file" }, { status: 500 });
	}
}
