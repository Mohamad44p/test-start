"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { UploadedItemDisplay } from "./UploadedItemDisplay"

interface UploadedItem {
  id: string
  name: string
  url: string
  type: "file" | "image" | "video"
  mimeType: string
  size: number
}

export function FilesList() {
  const [items, setItems] = useState<UploadedItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/universal-upload')
      const data = await response.json()
      if (data.success) {
        setItems(data.items)
      }
    } catch (error) {
      console.error("Failed to fetch items:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleDelete = () => {
    fetchItems()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <UploadedItemDisplay
          key={item.id}
          item={item}
          onDelete={handleDelete}
        />
      ))}
      {items.length === 0 && (
        <p className="text-gray-500 text-center col-span-full py-8">
          No uploaded items found
        </p>
      )}
    </div>
  )
}
