import { NextResponse } from 'next/server';
import { ContentStorage } from '@/lib/content-storage';
import { homeContent } from '@/../../content/home';

export async function GET() {
  try {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      vercel: !!process.env.VERCEL,
      tests: {
        staticContent: homeContent,
        blobContent: null as any,
        blobExists: false,
        blobError: null as string | null,
        fallbackContent: null as any
      }
    };

    // Test 1: Try to load from Blob storage directly
    try {
      const blobContent = await ContentStorage.load('home');
      diagnostics.tests.blobContent = blobContent;
      diagnostics.tests.blobExists = blobContent !== null;
    } catch (error) {
      diagnostics.tests.blobError = error instanceof Error ? error.message : String(error);
    }

    // Test 2: Try the fallback function
    try {
      const { getContentWithFallback } = await import('@/lib/content-storage');
      const fallbackContent = await getContentWithFallback('home', homeContent);
      diagnostics.tests.fallbackContent = fallbackContent;
    } catch (error) {
      diagnostics.tests.blobError = `Fallback error: ${error instanceof Error ? error.message : String(error)}`;
    }

    return NextResponse.json({
      success: true,
      diagnostics
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    // Test saving content
    const testData = {
      title: 'TEST - ' + new Date().toLocaleTimeString(),
      subtitle: 'Test subtitle from API',
      heroImage: '/test.jpg',
      heroImageAlt: 'Test image'
    };

    await ContentStorage.save('home', testData);

    // Try to read it back
    const savedContent = await ContentStorage.load('home');

    return NextResponse.json({
      success: true,
      message: 'Test save and load completed',
      testData,
      savedContent,
      matches: JSON.stringify(testData) === JSON.stringify(savedContent)
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      details: 'Failed during test save/load cycle'
    }, { status: 500 });
  }
}