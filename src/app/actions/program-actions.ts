"use server"

import { revalidatePath } from "next/cache"
import db from "@/app/db/db"
import type { CreateProgramInput, UpdateProgramInput } from "@/types/program-tab"

export async function createProgram(data: CreateProgramInput) {
  try {
    await db.programsPages.create({
      data,
    })

    const programs = await db.programsPages.findMany()

    revalidatePath("/admin/program-tabs")
    return { success: true, programs }
  } catch (error) {
    console.error("Failed to create program:", error)
    return { error: "Failed to create program" }
  }
}

export async function updateProgram(data: UpdateProgramInput) {
  try {
    await db.programsPages.update({
      where: { id: data.id },
      data,
    })

    const programs = await db.programsPages.findMany()

    revalidatePath("/admin/program-tabs")
    return { success: true, programs }
  } catch (error) {
    console.error("Failed to update program:", error)
    return { error: "Failed to update program" }
  }
}

export async function deleteProgram(id: string) {
  try {
    await db.programsPages.delete({
      where: { id },
    })

    const programs = await db.programsPages.findMany()

    revalidatePath("/admin/program-tabs")
    return { success: true, programs }
  } catch (error) {
    console.error("Failed to delete program:", error)
    return { error: "Failed to delete program" }
  }
}

