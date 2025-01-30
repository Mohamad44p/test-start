import { NextRequest, NextResponse } from 'next/server'
import { writeFile, access, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      console.error('No file provided')
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure the directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'videos')
    await ensureDir(uploadDir)

    const filename = `${Date.now()}-${file.name}`
    const filepath = path.join(uploadDir, filename)

    await writeFile(filepath, buffer)
    return NextResponse.json({ success: true, url: `/videos/${filename}` })
  } catch (error) {
    console.error('Error in upload-video route:', error)
    return NextResponse.json({ success: false, error: 'Failed to save file' }, { status: 500 })
  }
}

async function ensureDir(dirPath: string) {
  try {
    await access(dirPath)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    await mkdir(dirPath, { recursive: true })
  }
}

