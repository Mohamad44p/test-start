"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Loader2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { UploadedItemDisplay } from "./UploadedItemDisplay"

interface SingleItemUploadProps {
  type: "file" | "image" | "video"
  acceptedFileTypes: string[]
}

export function SingleItemUpload({ type, acceptedFileTypes }: SingleItemUploadProps) {
  const [uploading, setUploading] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [uploadedItem, setUploadedItem] = useState<any>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      setUploading(true)
      const file = acceptedFiles[0]
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", type)

      try {
        const response = await fetch("/api/universal-upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) throw new Error("Upload failed")

        const data = await response.json()
        setUploadedItem(data)
        toast({
          title: "Upload Successful",
          description: `Your ${type} has been uploaded successfully.`,
        })
      } catch (error) {
        console.error("Upload error:", error)
        toast({
          title: "Upload Failed",
          description: `There was an error uploading your ${type}. Please try again.`,
          variant: "destructive",
        })
      } finally {
        setUploading(false)
      }
    },
    [type],
  )

  const handleDelete = () => {
    setUploadedItem(null)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}),
    maxFiles: 1,
    multiple: false,
  })

  if (uploadedItem) {
    return <UploadedItemDisplay item={uploadedItem} onDelete={handleDelete} />
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:bg-gray-50"
        }`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-semibold mb-2">Drag & drop your {type} here</p>
            <p className="text-sm text-gray-500 mb-4">or click to select a {type}</p>
            <Button>Select {type}</Button>
          </div>
        )}
      </div>
    </div>
  )
}

