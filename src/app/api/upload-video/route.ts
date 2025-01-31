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

    // Validate file type
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Invalid file type' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
    await ensureDir(uploadDir);

    // Create a safe filename
    const uniqueFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const filepath = path.join(uploadDir, uniqueFilename);

    await writeFile(filepath, buffer);

    // Return the public URL
    const publicUrl = `/uploads/videos/${uniqueFilename}`;
    
    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      type: 'local',
      thumbnail: publicUrl + '?thumb=1' // You might want to generate actual thumbnails
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to save file' 
    }, { status: 500 });
  }
}

async function ensureDir(dirPath: string) {
  try {
    await access(dirPath);
  } catch {
    await mkdir(dirPath, { recursive: true });
  }
}

