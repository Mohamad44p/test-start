import type { FieldErrors } from 'react-hook-form'

export interface StatData {
  name_en: string
  name_ar: string
  value: number
  icon: string
}

interface ApiSuccess<T> {
  success: true
  data: T
  error?: never
}

interface ApiError {
  success: false
  data?: never
  error: string | FieldErrors
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

export type LanguageType = "en" | "ar"

