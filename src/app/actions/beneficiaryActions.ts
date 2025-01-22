/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"

import { revalidatePath } from "next/cache"
import { BeneficiaryFormInput, CategoryFormInput } from "@/lib/schema/beneficiarySchema"
import db from "@/app/db/db"
import slugify from "slugify"

export async function createBeneficiary(formData: FormData) {
  const data = {
    title_en: formData.get("title_en")?.toString() || "",
    title_ar: formData.get("title_ar")?.toString() || "",
    description_en: formData.get("description_en")?.toString() || "",
    description_ar: formData.get("description_ar")?.toString() || "",
    longDescription_en: formData.get("longDescription_en")?.toString() || "",
    longDescription_ar: formData.get("longDescription_ar")?.toString() || "",
    imageUrl: formData.get("imageUrl")?.toString() || "",
    ctaText: formData.get("ctaText")?.toString() || "",
    ctaLink: formData.get("ctaLink")?.toString() || "",
    categoryId: formData.get("categoryId")?.toString() || "",
  }

  try {
    const beneficiary = await db.beneficiary.create({
      data,
    })
    revalidatePath("/admin/beneficiaries")
    return { success: true, data: beneficiary }
  } catch (error) {
    return { success: false, error: "Failed to create beneficiary" }
  }
}

export async function updateBeneficiary(id: string, formData: FormData) {
  const data = {
    title_en: formData.get("title_en")?.toString() || "",
    title_ar: formData.get("title_ar")?.toString() || "",
    description_en: formData.get("description_en")?.toString() || "",
    description_ar: formData.get("description_ar")?.toString() || "",
    longDescription_en: formData.get("longDescription_en")?.toString() || "",
    longDescription_ar: formData.get("longDescription_ar")?.toString() || "",
    imageUrl: formData.get("imageUrl")?.toString() || "",
    ctaText: formData.get("ctaText")?.toString() || "",
    ctaLink: formData.get("ctaLink")?.toString() || "",
    categoryId: formData.get("categoryId")?.toString() || "",
  }

  try {
    const beneficiary = await db.beneficiary.update({
      where: { id },
      data,
    })
    revalidatePath("/admin/beneficiaries")
    return { success: true, data: beneficiary }
  } catch (error) {
    return { success: false, error: "Failed to update beneficiary" }
  }
}

export async function deleteBeneficiary(id: string) {
  try {
    await db.beneficiary.delete({
      where: { id },
    })
    revalidatePath("/admin/beneficiaries")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete beneficiary" }
  }
}

export async function createCategory(data: CategoryFormInput) {
  try {
    const slug = slugify(data.name_en.toLowerCase())
    const category = await db.category.create({
      data: {
        ...data,
        slug,
      },
    })
    revalidatePath("/admin/categories")
    return { success: true, data: category }
  } catch (error) {
    return { success: false, error: "Failed to create category" }
  }
}
