export enum PostType {
  BLOG = 'blog',
  PUBLICATION = 'publication',
  ANNOUNCEMENT = 'announcement'
}

export interface Tag {
  id: number
  name_en: string
  name_ar: string
  slug: string
}

export interface BlogPost {
  id: number
  type: PostType | string 
  slug: string
  title_en: string
  title_ar: string
  description_en: string | null
  description_ar: string | null
  content_en: string
  content_ar: string
  imageUrl: string | null
  readTime: string | null
  published: boolean
  featured: boolean
  authorId: number | null
  createdAt: Date
  updatedAt: Date
  tags: Tag[]
}

export interface LocalizedBlogPost {
  id: number
  type: PostType
  slug: string
  title: string
  description: string | null
  content: string
  imageUrl: string | null
  readTime: string | null
  published: boolean
  featured: boolean
  authorId: number | null
  createdAt: Date
  updatedAt: Date
  tags: { name: string; slug: string }[]
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Add a type guard to check if a string is a valid PostType
export function isPostType(type: string): type is PostType {
  return Object.values(PostType).includes(type as PostType);
}

// Update the conversion function to be case-insensitive
export function toPostType(type: string): PostType {
  const normalizedType = type.toLowerCase();
  switch (normalizedType) {
    case 'blog':
      return PostType.BLOG;
    case 'publication':
      return PostType.PUBLICATION;
    case 'announcement':
      return PostType.ANNOUNCEMENT;
    default:
      return PostType.BLOG;
  }
}
