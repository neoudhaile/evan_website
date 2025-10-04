import { NextRequest, NextResponse } from 'next/server';
import { ContentStorage } from '@/lib/content-storage';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate the data structure
    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid content data' },
        { status: 400 }
      );
    }

    // Validate required Gallery content fields
    if (!data.title || typeof data.gridColumns !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, gridColumns' },
        { status: 400 }
      );
    }

    // Validate imageMetadata structure
    if (data.imageMetadata && typeof data.imageMetadata !== 'object') {
      return NextResponse.json(
        { success: false, error: 'imageMetadata must be an object' },
        { status: 400 }
      );
    }

    // Save to Blob storage
    await ContentStorage.save('gallery', data);

    return NextResponse.json({
      success: true,
      message: 'Gallery content saved successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error saving Gallery content:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save content'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Load content from Blob storage
    const content = await ContentStorage.load('gallery');

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      content,
      source: 'blob'
    });

  } catch (error) {
    console.error('Error loading Gallery content:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load content'
      },
      { status: 500 }
    );
  }
}