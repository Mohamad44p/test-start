/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import { extensions } from '@/lib/tiptap/extensions'
import { Button } from '../ui/button'
import { ImageUpload } from '@/lib/ImageUpload'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Bold, 
  Italic, 
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Image,
  Link,
} from 'lucide-react'
import { useState } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (value: string) => void
  dir?: 'ltr' | 'rtl'
  placeholder?: string
}

export function RichTextEditor({
  content,
  onChange,
  dir = 'ltr',
}: RichTextEditorProps) {
  const [showImageDialog, setShowImageDialog] = useState(false)

  const editor = useEditor({
    extensions,
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[300px] px-4',
        dir,
        spellcheck: 'false',
      },
      handleDOMEvents: {
        keydown: (view, event) => {
          // Prevent form submission on Enter key
          if (event.key === 'Enter' && event.ctrlKey) {
            event.preventDefault()
            return true
          }
          return false
        },
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) return null

  const handleImageUpload = (url: string | null) => {
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
    setShowImageDialog(false)
  }

  const handleLinkAdd = () => {
    const url = window.prompt('Enter URL')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const preventDefault = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white" onClick={preventDefault}>
      <div className="border-b p-2 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={editor.isActive('bold') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleBold().run()}
          type="button"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant={editor.isActive('italic') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          type="button"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant={editor.isActive('underline') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          type="button"
        >
          <Underline className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant={editor.isActive('strike') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          type="button"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant={editor.isActive('link') ? 'default' : 'outline'}
          onClick={handleLinkAdd}
          type="button"
        >
          <Link className="h-4 w-4" />
        </Button>

        <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" type="button">
              <Image className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Image</DialogTitle>
            </DialogHeader>
            <ImageUpload onUpload={handleImageUpload} />
          </DialogContent>
        </Dialog>

        <Button
          size="sm"
          variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          type="button"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          type="button"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          type="button"
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant={editor.isActive('bulletList') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          type="button"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant={editor.isActive('orderedList') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          type="button"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="flex items-center gap-1 rounded-lg border bg-white p-1 shadow-lg">
            <Button
              size="sm"
              variant={editor.isActive('bold') ? 'default' : 'outline'}
              onClick={() => editor.chain().focus().toggleBold().run()}
              type="button"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={editor.isActive('italic') ? 'default' : 'outline'}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              type="button"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={editor.isActive('link') ? 'default' : 'outline'}
              onClick={handleLinkAdd}
              type="button"
            >
              <Link className="h-4 w-4" />
            </Button>
          </div>
        </BubbleMenu>
      )}

      <EditorContent editor={editor} />
    </div>
  )
}
