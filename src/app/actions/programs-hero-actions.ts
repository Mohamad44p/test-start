"use server"

import { revalidatePath } from "next/cache"
import db from "@/app/db/db"
import type { CreateProgramsHeroInput, UpdateProgramsHeroInput } from "@/types/programs-hero"

export async function createProgramsHero(data: CreateProgramsHeroInput) {
  if (!data) {
    return { error: "Invalid input data" }
  }

  try {
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined),
    ) as CreateProgramsHeroInput

    const programsHero = await db.programsHero.create({
      data: {
        ...cleanedData,
        programPage: cleanedData.programPageId ? { connect: { id: cleanedData.programPageId } } : undefined,
      },
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
    const programsHero = await db.programsHero.update({
      where: { id: data.id },
      data: {
        ...data,
        programPage: data.programPageId ? { connect: { id: data.programPageId } } : undefined,
      },
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

