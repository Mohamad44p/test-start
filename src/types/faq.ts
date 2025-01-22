import { z } from 'zod'

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
  category: FaqCategory
  createdAt: Date
  updatedAt: Date
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
  order: z.number().int().default(0),
})

export type FaqCategoryFormData = z.infer<typeof FaqCategorySchema>
export type FaqItemFormData = z.infer<typeof FaqItemSchema>
