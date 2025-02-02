"use server"

import { revalidatePath } from "next/cache"
import db from "@/app/db/db"
import { CreateProgramsHeroInput, UpdateProgramsHeroInput } from "@/types/programs-hero"

export async function createProgramsHero(data: CreateProgramsHeroInput) {
  try {
    const existingProgramsHero = await db.programsHero.findFirst()
    if (existingProgramsHero) {
      return { error: "Programs Hero already exists. You can only edit the existing one." }
    }

    const programsHero = await db.programsHero.create({
      data: {
        ...data,
        // Add legacy fields
        tagline: data.tagline_en,
        title: data.title_en,
        highlightWord: data.highlightWord_en,
        description: data.description_en,
      },
    })

    revalidatePath("/admin/programs-hero")
    return { success: true, programsHero }
  } catch (error) {
    console.error("Failed to create programs hero:", error)
    return { error: "Failed to create programs hero" }
  }
}

export async function updateProgramsHero(data: UpdateProgramsHeroInput) {
  try {
    const programsHero = await db.programsHero.update({
      where: { id: data.id },
      data: {
        ...data,
        // Add legacy fields
        tagline: data.tagline_en,
        title: data.title_en,
        highlightWord: data.highlightWord_en,
        description: data.description_en,
      },
    })

    revalidatePath("/admin/programs-hero")
    return { success: true, programsHero }
  } catch (error) {
    console.error("Failed to update programs hero:", error)
    return { error: "Failed to update programs hero" }
  }
}