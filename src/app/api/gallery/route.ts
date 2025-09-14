import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Get the path to the public/gallery directory
    const galleryDir = path.join(process.cwd(), 'public', 'gallery');

    // Read all files in the directory
    const filenames = fs.readdirSync(galleryDir);

    // Filter for image files only (jpg, jpeg, png, gif, webp)
    const imageFiles = filenames.filter(file =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file) &&
      !file.startsWith('.') // Ignore hidden files like .DS_Store
    );

    // Transform filenames into gallery data structure
    const galleryData = imageFiles.map((filename, index) => ({
      id: index + 1,
      filename: filename,
      src: `/gallery/${filename}`,
      title: cleanTitle(filename)
    }));

    return NextResponse.json(galleryData);
  } catch (error) {
    console.error('Error reading gallery directory:', error);
    return NextResponse.json(
      { error: 'Failed to read gallery directory' },
      { status: 500 }
    );
  }
}

// Helper function to clean up filename for display
function cleanTitle(filename: string): string {
  return filename
    .replace(/\.(jpg|jpeg|png|gif|webp)$/i, '') // Remove file extension
    .replace(/_/g, ' ') // Replace underscores with spaces
    .trim(); // Remove any extra whitespace
}