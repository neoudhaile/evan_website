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

    // Save to Blob storage
    await ContentStorage.save('home', data);

    return NextResponse.json({
      success: true,
      message: 'Home content saved successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error saving home content:', error);
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
    const content = await ContentStorage.load('home');

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
    console.error('Error loading home content:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load content'
      },
      { status: 500 }
    );
  }
}