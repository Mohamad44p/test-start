import { Suspense } from 'react'
import EditBlogForm from './EditBlogForm'
import db from '@/app/db/db'

async function fetchBlogById(id: number) {
    const blog = await db.post.findUnique({
      where: { id },
      include: {
        tags: true,
      },
    })
  
    return blog
  }
  

export default async function EditBlog(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = parseInt(params.id, 10)
  const blog = await fetchBlogById(id)

  if (!blog) {
    return <div>Blog post not found</div>
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Blog Post</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <EditBlogForm blog={blog} />
      </Suspense>
    </div>
  )
}

