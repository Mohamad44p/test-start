import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { mkdir } from 'fs/promises'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) {
      return NextResponse.json({ error: 'No file received' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'files')
    await mkdir(uploadDir, { recursive: true })

    // Create a safe filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '-')
    const safePath = join(uploadDir, `${uniqueSuffix}-${filename}`)
    
    await writeFile(safePath, buffer)
    const publicPath = `/uploads/files/${uniqueSuffix}-${filename}`

    return NextResponse.json({ url: publicPath }) // Changed from urls to url
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
