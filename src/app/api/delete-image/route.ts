import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path, { join } from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: "No image URL provided" },
        { status: 400 }
      );
    }

    // Clean up the image URL and handle both URL formats
    const relativePath = imageUrl
      .split('/uploads/files/')
      .pop()
      ?.replace(/^\//, '')
      .split('/')
      .join(path.sep);

    if (!relativePath) {
      return NextResponse.json(
        { success: false, error: "Invalid image path" },
        { status: 400 }
      );
    }

    const uploadsPath = join(process.cwd(), 'public', 'uploads', 'files');
    const filepath = join(uploadsPath, relativePath);

    // Security check to ensure the file is within the uploads directory
    if (!filepath.startsWith(uploadsPath)) {
      return NextResponse.json(
        { success: false, error: "Invalid file path" },
        { status: 400 }
      );
    }

    // Debug logging
    console.log('Attempting to delete file:', {
      originalUrl: imageUrl,
      relativePath,
      fullPath: filepath,
      exists: existsSync(filepath)
    });

    if (!existsSync(filepath)) {
      return NextResponse.json(
        { success: false, error: "File not found", path: relativePath },
        { status: 404 }
      );
    }

    await unlink(filepath);
    return NextResponse.json({ 
      success: true,
      message: "File deleted successfully",
      path: relativePath
    });
    
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to delete file",
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
