'use server'

import { cache } from 'react'
import db from '../db/db'
import { type BlogPost, type PostType, type ApiResponse, toPostType } from '@/types/blog'

export const getFeaturedPosts = cache(async (): Promise<ApiResponse<BlogPost[]>> => {
  try {
    const posts = await db.post.findMany({
      where: {
        featured: true,
        published: true
      },
      select: {
        id: true,
        type: true,
        slug: true,
        title_en: true,
        title_ar: true,
        description_en: true,
        description_ar: true,
        content_en: true,
        content_ar: true,
        imageUrl: true,
        readTime: true,
        published: true,
        featured: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
        tags: {
          select: {
            id: true,
            name_en: true,
            name_ar: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 6
    }) as unknown as BlogPost[]

    return { success: true, data: posts }
  } catch (error) {
    console.error("Error fetching featured posts:", error)
    return { success: false, error: "Failed to fetch featured posts" }
  }
})

export const getPostsByType = cache(async (type: string): Promise<ApiResponse<BlogPost[]>> => {
  if (!type) {
    return { success: false, error: 'Post type is required' }
  }

  try {
    const posts = await db.post.findMany({
      where: {
        type: type.toLowerCase(),
        published: true
      },
      select: {
        id: true,
        type: true,
        slug: true,
        title_en: true,
        title_ar: true,
        description_en: true,
        description_ar: true,
        content_en: true,
        content_ar: true,
        imageUrl: true,
        readTime: true,
        published: true,
        featured: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
        tags: {
          select: {
            id: true,
            name_en: true,
            name_ar: true,
            slug: true
          }
        }
      }
    }) as unknown as BlogPost[]
    
    if (!posts || posts.length === 0) {
      return { 
        success: true, 
        data: [], 
        error: `No ${type} posts found` 
      }
    }
    
    return { success: true, data: posts }
  } catch (error) {
    console.error(`Error fetching ${type} posts:`, error)
    return { 
      success: false, 
      error: `Failed to fetch ${type} posts`,
      data: [] 
    }
  }
})

export const getAnnouncementsByCategory = cache(async (category: string): Promise<ApiResponse<BlogPost[]>> => {
  try {
    const posts = await db.post.findMany({
      where: {
        type: 'announcement',
        published: true,
        tags: {
          some: {
            slug: category
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        tags: {
          select: {
            name_en: true,
            name_ar: true,
            slug: true
          }
        }
      }
    }) as unknown as BlogPost[]

    return { success: true, data: posts }
  } catch (error) {
    console.error('Error fetching announcements by category:', error)
    return { success: false, error: 'Failed to fetch announcements' }
  }
})

export const getPostBySlug = cache(async (slug: string): Promise<ApiResponse<BlogPost>> => {
  try {
    const post = await db.post.findUnique({
      where: { slug },
      include: {
        tags: true
      }
    }) as unknown as BlogPost

    if (!post) {
      return { success: false, error: 'Post not found' }
    }

    return { success: true, data: post }
  } catch (error) {
    console.error('Error fetching post:', error)
    return { success: false, error: 'Failed to fetch post' }
  }
})

export const getRelatedPosts = cache(async (
  type: PostType | string, 
  currentSlug: string,
  limit = 3
): Promise<ApiResponse<BlogPost[]>> => {
  try {
    const postType = typeof type === 'string' ? toPostType(type) : type
    const posts = await db.post.findMany({
      where: {
        type: postType,
        published: true,
        slug: { not: currentSlug }
      },
      select: {
        id: true,
        type: true,
        slug: true,
        title_en: true,
        title_ar: true,
        description_en: true,
        description_ar: true,
        content_en: true,
        content_ar: true,
        imageUrl: true,
        readTime: true,
        published: true,
        featured: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
        tags: {
          select: {
            id: true,
            name_en: true,
            name_ar: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    }) as unknown as BlogPost[]

    return { success: true, data: posts }
  } catch (error) {
    console.error("Error fetching related posts:", error)
    return { success: false, error: "Failed to fetch related posts" }
  }
})
