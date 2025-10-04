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

    // Validate required Listen content fields
    if (!data.title || !data.description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, description' },
        { status: 400 }
      );
    }

    // Validate social links array
    if (!Array.isArray(data.socialLinks)) {
      return NextResponse.json(
        { success: false, error: 'Social links must be an array' },
        { status: 400 }
      );
    }

    // Validate each social link has required fields
    for (const link of data.socialLinks) {
      if (!link.name || !link.href || !link.bgColor || !link.hoverColor) {
        return NextResponse.json(
          { success: false, error: 'Each social link must have name, href, bgColor, and hoverColor' },
          { status: 400 }
        );
      }
    }

    // Save to Blob storage
    await ContentStorage.save('listen', data);

    return NextResponse.json({
      success: true,
      message: 'Listen content saved successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error saving Listen content:', error);
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
    const content = await ContentStorage.load('listen');

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
    console.error('Error loading Listen content:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load content'
      },
      { status: 500 }
    );
  }
}