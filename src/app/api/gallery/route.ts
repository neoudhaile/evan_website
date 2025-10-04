import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface GalleryMetadata {
  title?: string;
  description?: string;
  order?: number;
  visible?: boolean;
}
import { ContentStorage } from '@/lib/content-storage';

export async function GET() {
  try {
    // Get gallery metadata from admin (with fallback to static content)
    let galleryMetadata = await ContentStorage.load('gallery');

    // In development mode, if no blob content, load from static file
    if (!galleryMetadata && process.env.NODE_ENV === 'development') {
      try {
        const { galleryContent } = await import('../../../../content/gallery');
        galleryMetadata = galleryContent;
      } catch {
        console.log('No static gallery content found, using empty metadata');
      }
    }

    const metadata = galleryMetadata?.imageMetadata || ({} as Record<string, GalleryMetadata>);

    // Helper function to safely get metadata
    const getFileMetadata = (filename: string): GalleryMetadata => {
      return (metadata as Record<string, GalleryMetadata>)[filename] || ({} as GalleryMetadata);
    };

    // Get the path to the public/gallery directory
    const galleryDir = path.join(process.cwd(), 'public', 'gallery');

    // Check if directory exists
    if (!fs.existsSync(galleryDir)) {
      return NextResponse.json([]);
    }

    // Read all files in the directory
    const filenames = fs.readdirSync(galleryDir);

    // Filter for image files only (jpg, jpeg, png, gif, webp)
    const imageFiles = filenames.filter(file =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file) &&
      !file.startsWith('.') // Ignore hidden files like .DS_Store
    );

    // Transform filenames with metadata overlay
    const galleryData = imageFiles
      .map((filename, index) => {
        const fileMetadata = getFileMetadata(filename);
        return {
          id: index + 1,
          filename: filename,
          src: `/gallery/${filename}`,
          title: fileMetadata.title || cleanTitle(filename),
          description: fileMetadata.description || '',
          order: fileMetadata.order ?? index,
          visible: fileMetadata.visible !== false // Default to visible
        };
      })
      .filter(image => image.visible) // Only show visible images
      .sort((a, b) => a.order - b.order); // Sort by order

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