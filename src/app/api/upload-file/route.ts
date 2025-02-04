import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get("file") as unknown as File

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const filename = `${Date.now()}-${file.name}`
    let filepath: string

    // Ensure the upload directories exist
    const uploadDir = path.join(process.cwd(), "public/uploads")
    const imageDir = path.join(uploadDir, "images")
  const fileDir = path.join(uploadDir, "files")

    await Promise.all([
      import("fs").then((fs) => fs.promises.mkdir(uploadDir, { recursive: true })),
      import("fs").then((fs) => fs.promises.mkdir(imageDir, { recursive: true })),
      import("fs").then((fs) => fs.promises.mkdir(fileDir, { recursive: true })),
    ])

    if (file.type.startsWith("image/")) {
      filepath = path.join(imageDir, filename)
    } else {
      filepath = path.join(fileDir, filename)
    }

    await writeFile(filepath, buffer)
    const fileUrl = `/uploads/${file.type.startsWith("image/") ? "images" : "files"}/${filename}`
    return NextResponse.json({ success: true, url: fileUrl })
  } catch (error) {
    console.error("Error saving file:", error)
    return NextResponse.json({ success: false, error: "Failed to save file" }, { status: 500 })
  }
}

