import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'
import { readFile } from 'fs/promises'

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url')
    if (!url) {
      return new NextResponse('Missing URL parameter', { status: 400 })
    }

    // Remove leading slash and any attempts to navigate up directories
    const safePath = url.replace(/^\/+/, '').replace(/\.\./g, '')
    const filePath = join(process.cwd(), 'public', safePath)

    try {
      const fileBuffer = await readFile(filePath)
      const fileName = safePath.split('/').pop()

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Content-Type': 'application/octet-stream',
        },
      })
    } catch (error) {
      console.error('File read error:', error)
      return new NextResponse('File not found', { status: 404 })
    }
  } catch (error) {
    console.error('Download error:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
