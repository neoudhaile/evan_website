import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Create the TypeScript content
    const tsContent = `export const homeContent = ${JSON.stringify(data, null, 2)};`;

    // Write to the content file
    const filePath = path.join(process.cwd(), 'content', 'home.ts');
    await writeFile(filePath, tsContent, 'utf8');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving home content:', error);
    return NextResponse.json({ success: false, error: 'Failed to save content' }, { status: 500 });
  }
}