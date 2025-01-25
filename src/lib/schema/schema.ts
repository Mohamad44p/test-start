import { z } from "zod";

export const PostType = {
  BLOG: 'blog',
  PUBLICATION: 'publication',
  ANNOUNCEMENT: 'announcement'
} as const

export type PostType = typeof PostType[keyof typeof PostType]

export const createPostSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  type: z.enum([PostType.BLOG, PostType.PUBLICATION, PostType.ANNOUNCEMENT], {
    required_error: "Type is required",
  }),
  title_en: z.string().min(1, "English title is required"),
  title_ar: z.string().min(1, "Arabic title is required"),
  description_en: z.string().optional(),
  description_ar: z.string().optional(),
  content_en: z.string().min(1, "English content is required"),
  content_ar: z.string().min(1, "Arabic content is required"),
  imageUrl: z.string().nullable(),
  readTime: z.string().optional(),  // Changed from number to string
  published: z.boolean(),
  featured: z.boolean(),
  tags: z.array(z.string()),
})

export type CreatePostInput = z.infer<typeof createPostSchema>

export const createTagSchema = z.object({
  name_en: z.string().min(1, "English tag name is required"),
  name_ar: z.string().min(1, "Arabic tag name is required"),
})

export type CreateTagInput = z.infer<typeof createTagSchema>


export const createGallerySchema = z.object({
  title_en: z.string().min(1, "English title is required"),
  title_ar: z.string().min(1, "Arabic title is required"),
  date: z.string(),
  imageUrls: z.array(z.string()).min(1, "At least one image is required"),
  imageTitles_en: z.array(z.string().nullable()),
  imageTitles_ar: z.array(z.string().nullable()),
  imageFeatured: z.array(z.boolean()).refine((data) => data.filter(Boolean).length === 1, {
    message: "Exactly one image must be featured",
  }),
});

export type CreateGalleryInput = z.infer<typeof createGallerySchema>;

export const editGallerySchema = z.object({
  title_en: z.string().min(1, "English title is required"),
  title_ar: z.string().min(1, "Arabic title is required"),
  date: z.string(),
  imageUrls: z.array(z.string()).min(1, "At least one image is required"),
  imageTitles_en: z.array(z.string().nullable()),
  imageTitles_ar: z.array(z.string().nullable()),
  imageFeatured: z.array(z.boolean()).refine((data) => data.filter(Boolean).length === 1, {
    message: "Exactly one image must be featured",
  }),
  deletedImageIds: z.array(z.string()),
});

export type EditGalleryInput = z.infer<typeof editGallerySchema>;

export const videoSchema = z.object({
  url: z.string().min(1, "Video URL is required"),
  title_en: z.string().min(1, "English title is required"),
  title_ar: z.string().min(1, "Arabic title is required"),
  description_en: z.string().nullable().optional(),
  description_ar: z.string().nullable().optional(),
  type: z.enum(['youtube', 'local']),  // Add this line
});

export const createVideoGallerySchema = z.object({
  title_en: z.string().min(1, "English title is required"),
  title_ar: z.string().min(1, "Arabic title is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  videos: z.array(videoSchema).min(1, "At least one video is required"),
});

export const updateVideoGallerySchema = createVideoGallerySchema.extend({
  id: z.string(),
});

export type CreateVideoGalleryInput = z.infer<typeof createVideoGallerySchema>;
export type UpdateVideoGalleryInput = z.infer<typeof updateVideoGallerySchema>;


