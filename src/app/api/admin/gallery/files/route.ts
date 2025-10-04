import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Get the path to the public/gallery directory
    const galleryDir = path.join(process.cwd(), 'public', 'gallery');

    // Check if directory exists
    if (!fs.existsSync(galleryDir)) {
      return NextResponse.json([]);
    }

    // Read all files in the directory
    const filenames = fs.readdirSync(galleryDir);

    // Filter for image files only
    const imageFiles = filenames.filter(file =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file) &&
      !file.startsWith('.') // Ignore hidden files like .DS_Store
    );

    // Get file stats and create file info objects
    const filesWithStats = imageFiles.map((filename, index) => {
      const filePath = path.join(galleryDir, filename);
      const stats = fs.statSync(filePath);
      return {
        filename,
        src: `/gallery/${filename}`,
        size: stats.size,
        modified: stats.mtime.toISOString(),
        index
      };
    });

    // Sort by modification date (newest first)
    filesWithStats.sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());

    return NextResponse.json(filesWithStats);
  } catch (error) {
    console.error('Error reading gallery files:', error);
    return NextResponse.json(
      { error: 'Failed to read gallery files' },
      { status: 500 }
    );
  }
}