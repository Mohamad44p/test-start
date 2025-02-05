import { z } from 'zod'

export type LanguageType = 'en' | 'ar'

export interface FaqCategory {
  id: string
  nameEn: string
  nameAr: string
  slug: string
  order: number
  faqs: FaqItem[]
  createdAt: Date
  updatedAt: Date
}

export interface FaqItem {
  id: string
  questionEn: string
  questionAr: string
  answerEn: string
  answerAr: string
  order: number
  categoryId: string
  category?: FaqCategory // Make category optional
  programId?: string | null;
  program?: {
    id: string;
    name_en: string;
    name_ar: string;
  } | null;
  createdAt: Date
  updatedAt: Date
}

export interface FaqData {
  categories: FaqCategory[]
  faqsByCategory: Record<string, FaqItem[]>
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export const FaqCategorySchema = z.object({
  nameEn: z.string().min(1, "English name is required"),
  nameAr: z.string().min(1, "Arabic name is required"),
  slug: z.string().min(1, "Slug is required"),
  order: z.number().int().default(0),
})

export const FaqItemSchema = z.object({
  questionEn: z.string().min(1, "English question is required"),
  questionAr: z.string().min(1, "Arabic question is required"),
  answerEn: z.string().min(1, "English answer is required"),
  answerAr: z.string().min(1, "Arabic answer is required"),
  categoryId: z.string().min(1, "Category is required"),
  programId: z.string().optional().nullable(),
  order: z.number().int().default(0),
})

export type FaqCategoryFormData = z.infer<typeof FaqCategorySchema>
export type FaqItemFormData = z.infer<typeof FaqItemSchema>
