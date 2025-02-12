import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Center</h1>
      <div className="flex space-x-4">
        <Link href="/filesmangemnt/upload/file">
          <Button>Upload File</Button>
        </Link>
        <Link href="/filesmangemnt/upload/image">
          <Button>Upload Image</Button>
        </Link>
        <Link href="/filesmangemnt/upload/video">
          <Button>Upload Video</Button>
        </Link>
      </div>
    </div>
  )
}

