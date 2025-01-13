// /api/admin-data
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'admin-data.json');

console.log("Resolved data file path:", dataFilePath);

export async function GET() {
    try {
        const data = await fs.readFile(dataFilePath, 'utf-8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
        return NextResponse.json({ message: 'Data updated successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
    }
}

