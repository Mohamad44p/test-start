/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"

import { revalidatePath } from "next/cache"
import db from "@/app/db/db"
import type { CreateProgramsHeroInput, UpdateProgramsHeroInput } from "@/types/programs-hero"

export async function createProgramsHero(data: CreateProgramsHeroInput) {
  if (!data) {
    return { error: "Invalid input: Payload cannot be null" }
  }

  try {
    const { 
      programPageId, 
      objectives_en, 
      objectives_ar,
      eligibility_en,
      eligibility_ar,
      ...cleanedData 
    } = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v != null),
    ) as CreateProgramsHeroInput

    if (!cleanedData.title_en?.trim() || !cleanedData.title_ar?.trim()) {
      return { error: "Title in both English and Arabic is required" }
    }
    if (!cleanedData.description_en?.trim() || !cleanedData.description_ar?.trim()) {
      return { error: "Description in both English and Arabic is required" }
    }
    if (!cleanedData.tagline_en?.trim() || !cleanedData.tagline_ar?.trim()) {
      return { error: "Tagline in both English and Arabic is required" }
    }

    const createData = {
      ...cleanedData,
      objectives_en: objectives_en || null,
      objectives_ar: objectives_ar || null,
      eligibility_en: eligibility_en || null,
      eligibility_ar: eligibility_ar || null,
      card2Show: cleanedData.card2Show ?? false,
      card3Show: cleanedData.card3Show ?? false,
      programPageId,
    } as const

    if (programPageId) {
      Object.assign(createData, {
        programPage: {
          connect: { id: programPageId }
        }
      })
    }

    const programsHero = await db.programsHero.create({
      data: createData,
      include: {
        programPage: true,
      },
    })

    revalidatePath("/admin/programs-hero")
    return { success: true, programsHero }
  } catch (error) {
    console.error("Failed to create programs hero:", error)
    if (error instanceof Error) {
      return { error: `Failed to create programs hero: ${error.message}` }
    }
    return { error: "Failed to create programs hero" }
  }
}

export async function updateProgramsHero(data: UpdateProgramsHeroInput) {
  try {
    const { 
      programPageId, 
      id, 
      objectives_en, 
      objectives_ar,
      eligibility_en,
      eligibility_ar, 
      ...updateData 
    } = data

    const updatePayload = {
      ...updateData,
      objectives_en: objectives_en || null,
      objectives_ar: objectives_ar || null,
      eligibility_en: eligibility_en || null,
      eligibility_ar: eligibility_ar || null,
      ...(programPageId ? { programPageId } : {}),
    }

    const programsHero = await db.programsHero.update({
      where: { id },
      data: updatePayload,
      include: {
        programPage: true
      }
    })

    revalidatePath("/admin/programs-hero")
    return { success: true, programsHero }
  } catch (error) {
    console.error("Failed to update programs hero:", error)
    return { error: "Failed to update programs hero" }
  }
}

export async function deleteProgramsHero(id: string) {
  try {
    await db.programsHero.delete({
      where: { id },
    })

    revalidatePath("/admin/programs-hero")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete programs hero:", error)
    return { error: "Failed to delete programs hero" }
  }
}

export async function getProgramsHeroes() {
  try {
    const programsHeroes = await db.programsHero.findMany({
      include: { programPage: true },
    })
    return { success: true, programsHeroes }
  } catch (error) {
    console.error("Failed to fetch programs heroes:", error)
    return { error: "Failed to fetch programs heroes" }
  }
}

