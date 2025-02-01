import { NextRequest, NextResponse } from 'next/server';
import { writeFile, access, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Validate file type and size
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Invalid file type' }, { status: 400 });
    }

    // 100MB max size
    const maxSize = 100 * 1024 * 1024; 
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, error: 'File too large' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create absolute path to uploads directory
    const uploadDir = path.join('public', 'uploads', 'videos');
    const absoluteUploadDir = path.join(process.cwd(), uploadDir);

    try {
      await access(absoluteUploadDir);
    } catch {
      await mkdir(absoluteUploadDir, { recursive: true });
    }

    // Create a safe filename with timestamp
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
    const uniqueFilename = `${timestamp}-${safeName}`;
    const filePath = path.join(absoluteUploadDir, uniqueFilename);

    // Write the file
    await writeFile(filePath, buffer);

    // Return the URL path relative to /public
    const publicUrl = `/uploads/videos/${uniqueFilename}`;

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      type: 'local'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to save file' 
    }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '100mb',
  },
};

