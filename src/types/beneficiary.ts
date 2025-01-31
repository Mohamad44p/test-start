export interface Beneficiary {
  id: string
  title_en: string
  title_ar: string
  description_en: string
  description_ar: string
  longDescription_en: string
  longDescription_ar: string
  imageUrl: string
  ctaText: string
  ctaLink: string
  categoryId: string
  category: Category
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name_en: string
  name_ar: string
  slug: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
