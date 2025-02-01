import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ success: false, error: 'No URL provided' }, { status: 400 });
    }

    // Handle local video deletion
    if (url.startsWith('/uploads/videos/')) {
      const publicPath = path.join(process.cwd(), 'public');
      const filePath = path.join(publicPath, url);

      // Security check to ensure we're only deleting from uploads directory
      if (!filePath.startsWith(path.join(publicPath, 'uploads', 'videos'))) {
        return NextResponse.json({ success: false, error: 'Invalid file path' }, { status: 400 });
      }

      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        return NextResponse.json({ success: true });
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          // File doesn't exist, consider it a success for idempotency
          return NextResponse.json({ success: true });
        }
        throw error;
      }
    }

    // For YouTube videos, just return success
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete file' 
    }, { status: 500 });
  }
}
