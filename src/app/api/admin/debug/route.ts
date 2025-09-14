import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readdir, access } from 'fs/promises';
import path from 'path';
import { constants } from 'fs';

export async function GET(request: NextRequest) {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    platform: process.platform,
    cwd: process.cwd(),
    vercel: !!process.env.VERCEL,
    filesystem: {
      canRead: false,
      canWrite: false,
      contentDirExists: false,
      contentDirContents: [] as string[],
    },
    errors: [] as string[]
  };

  try {
    // Test if content directory exists and is readable
    const contentDir = path.join(process.cwd(), 'content');

    try {
      await access(contentDir, constants.R_OK);
      diagnostics.filesystem.canRead = true;

      try {
        const contents = await readdir(contentDir);
        diagnostics.filesystem.contentDirExists = true;
        diagnostics.filesystem.contentDirContents = contents;
      } catch (readError) {
        diagnostics.errors.push(`Cannot read content directory: ${readError}`);
      }
    } catch (accessError) {
      diagnostics.errors.push(`Cannot access content directory: ${accessError}`);
    }

    // Test write capability
    try {
      const testFile = path.join(process.cwd(), 'test-write.tmp');
      await writeFile(testFile, 'test', 'utf8');
      diagnostics.filesystem.canWrite = true;

      // Clean up test file
      try {
        const { unlink } = await import('fs/promises');
        await unlink(testFile);
      } catch (unlinkError) {
        diagnostics.errors.push(`Could not clean up test file: ${unlinkError}`);
      }
    } catch (writeError) {
      diagnostics.errors.push(`Cannot write to filesystem: ${writeError}`);
      diagnostics.filesystem.canWrite = false;
    }

  } catch (error) {
    diagnostics.errors.push(`General error: ${error}`);
  }

  return NextResponse.json(diagnostics, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export async function POST(request: NextRequest) {
  const testData = await request.json();

  try {
    // Test the exact same operation as the admin endpoints
    const tsContent = `export const testContent = ${JSON.stringify(testData, null, 2)};`;
    const filePath = path.join(process.cwd(), 'content', 'test-admin-write.ts');

    await writeFile(filePath, tsContent, 'utf8');

    return NextResponse.json({
      success: true,
      message: 'Write test successful',
      filePath,
      content: tsContent.substring(0, 100) + '...'
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error),
      message: 'Write test failed - this confirms filesystem is read-only'
    }, { status: 500 });
  }
}