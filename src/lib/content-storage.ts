import { put, head, list } from '@vercel/blob';
import { writeFile } from 'fs/promises';
import path from 'path';

// Types for our content
export interface ContentData {
  [key: string]: unknown;
}

export class ContentStorage {
  private static getContentKey(contentType: string): string {
    return `admin-content/${contentType}.json`;
  }

  private static isLocalDevelopment(): boolean {
    return process.env.NODE_ENV === 'development' && !process.env.VERCEL;
  }

  /**
   * Save content to Blob storage (with local development fallback)
   */
  static async save(contentType: string, data: ContentData): Promise<void> {
    try {
      // In local development, fall back to file system for testing
      if (this.isLocalDevelopment()) {
        console.log(`🔧 Local development: saving ${contentType} to filesystem`);
        const tsContent = `export const ${contentType}Content = ${JSON.stringify(data, null, 2)};`;
        const filePath = path.join(process.cwd(), 'content', `${contentType}.ts`);
        await writeFile(filePath, tsContent, 'utf8');
        console.log(`✅ Content saved locally: ${filePath}`);
        return;
      }

      // Production: use Blob storage
      const key = this.getContentKey(contentType);
      const jsonContent = JSON.stringify(data, null, 2);

      // Put the content as a JSON blob
      await put(key, jsonContent, {
        access: 'public', // Makes it readable via URL
        contentType: 'application/json',
        allowOverwrite: true // Allow updating existing content
      });

      console.log(`✅ Content saved to Blob: ${key}`);
    } catch (error) {
      console.error(`❌ Failed to save content:`, error);
      throw new Error(`Failed to save ${contentType} content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Load content from Blob storage (with local development fallback)
   */
  static async load(contentType: string): Promise<ContentData | null> {
    try {
      // In local development, always return null to use static files
      if (this.isLocalDevelopment()) {
        console.log(`🔧 Local development: using static file for ${contentType}`);
        return null;
      }

      // Production: load from Blob storage
      const key = this.getContentKey(contentType);

      // First check if the blob exists and get the URL
      let blobInfo;
      try {
        blobInfo = await head(key);
      } catch {
        console.log(`📝 No Blob content found for ${contentType}, will use fallback`);
        return null;
      }

      // Fetch the content using the blob URL
      const response = await fetch(blobInfo.url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const content = await response.json();
      console.log(`✅ Content loaded from Blob: ${key}`);
      return content;

    } catch (error) {
      console.error(`❌ Failed to load content from Blob:`, error);
      return null; // Return null to trigger fallback to static files
    }
  }

  /**
   * List all admin content in Blob storage
   */
  static async listContent(): Promise<string[]> {
    try {
      const { blobs } = await list({
        prefix: 'admin-content/',
        limit: 100,
      });

      return blobs.map(blob =>
        blob.pathname.replace('admin-content/', '').replace('.json', '')
      );
    } catch (error) {
      console.error('❌ Failed to list content:', error);
      return [];
    }
  }

  /**
   * Check if content exists in Blob storage
   */
  static async exists(contentType: string): Promise<boolean> {
    try {
      const key = this.getContentKey(contentType);
      await head(key);
      return true;
    } catch {
      return false;
    }
  }
}

// Helper function to get content with fallback to static files
export async function getContentWithFallback<T>(
  contentType: string,
  fallbackData: T
): Promise<T> {
  // Try to load from Blob first
  const blobContent = await ContentStorage.load(contentType);

  console.log(`🔍 Content loading debug:`, {
    contentType,
    blobContentExists: !!blobContent,
    blobContent: blobContent ? JSON.stringify(blobContent) : null,
    fallbackData: JSON.stringify(fallbackData),
    environment: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL
  });

  if (blobContent) {
    console.log(`🔥 Using BLOB content for ${contentType}`);
    return blobContent as T;
  }

  // Fall back to static file content
  console.log(`📁 Using fallback content for ${contentType}`);
  return fallbackData;
}