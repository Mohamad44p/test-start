"use server"

import { revalidatePath } from "next/cache"
import db from "@/app/db/db"
import type { CreateProgramTabInput, UpdateProgramTabInput } from "@/types/program-tab"

export async function createProgramTab(data: CreateProgramTabInput) {
  try {
    const programTab = await db.programTab.create({
      data: {
        ...data,
        processFile: data.processFile || null,
      },
      include: {
        programPage: true,
      },
    })

    revalidatePath("/admin/program-tabs")
    return { success: true, programTab }
  } catch (error) {
    console.error("Failed to create program tab:", error)
    return { error: "Failed to create program tab" }
  }
}

export async function updateProgramTab(data: UpdateProgramTabInput) {
  try {
    const programTab = await db.programTab.update({
      where: { id: data.id },
      data: {
        ...data,
        processFile: data.processFile || null,
      },
      include: {
        programPage: true,
      },
    })

    revalidatePath("/admin/program-tabs")
    return { success: true, programTab }
  } catch (error) {
    console.error("Failed to update program tab:", error)
    return { error: "Failed to update program tab" }
  }
}

export async function deleteProgramTab(id: string) {
  try {
    await db.programTab.delete({
      where: { id },
    })

    revalidatePath("/admin/program-tabs")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete program tab:", error)
    return { error: "Failed to delete program tab" }
  }
}

