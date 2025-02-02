import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const urls: string[] = []

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      const bytes = await value.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const filename = `${Date.now()}-${value.name}`
      const filepath = path.join(process.cwd(), 'public/images', filename)

      try {
        await writeFile(filepath, buffer)
        urls.push(`/images/${filename}`)
      } catch (error) {
        console.error('Error saving file:', error)
        return NextResponse.json(
          { success: false, error: 'Failed to save file' },
          { status: 500 }
        )
      }
    }
  }

  return NextResponse.json({ success: true, urls })
}

