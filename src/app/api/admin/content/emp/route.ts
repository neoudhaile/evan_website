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

    // Validate required EMP content fields
    if (!data.title || !data.logo || !data.logoAlt || !data.introduction) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, logo, logoAlt, introduction' },
        { status: 400 }
      );
    }

    // Validate services array
    if (!Array.isArray(data.services)) {
      return NextResponse.json(
        { success: false, error: 'Services must be an array' },
        { status: 400 }
      );
    }

    // Validate each service has required fields
    for (const service of data.services) {
      if (!service.title || !service.description) {
        return NextResponse.json(
          { success: false, error: 'Each service must have title and description' },
          { status: 400 }
        );
      }
    }

    // Save to Blob storage
    await ContentStorage.save('emp', data);

    return NextResponse.json({
      success: true,
      message: 'EMP content saved successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error saving EMP content:', error);
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
    const content = await ContentStorage.load('emp');

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
    console.error('Error loading EMP content:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load content'
      },
      { status: 500 }
    );
  }
}