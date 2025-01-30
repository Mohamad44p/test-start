"use server"

import db from "@/app/db/db"
import { revalidatePath } from "next/cache"

export type FocusareaData = {
  titleEn: string
  titleAr: string
  cards: {
    titleEn: string
    titleAr: string
    imageUrl: string
  }[]
}

export async function getFocusareas() {
  return db.focusarea.findMany({
    include: {
      cards: true,
    },
  })
}

export async function getFocusareaById(id: string) {
  return db.focusarea.findUnique({
    where: { id },
    include: {
      cards: true,
    },
  })
}

export async function createFocusarea(data: FocusareaData) {
  const { cards, ...focusareaData } = data

  const createdFocusarea = await db.focusarea.create({
    data: {
      ...focusareaData,
      descriptionEn: "", // Default value for required field
      descriptionAr: "", // Default value for required field
      cards: {
        create: cards,
      },
    },
    include: {
      cards: true,
    },
  })

  revalidatePath("/admin/pages/focusareas")
  return createdFocusarea
}

export async function updateFocusarea(id: string, data: FocusareaData) {
  const { cards, ...focusareaData } = data

  const updatedFocusarea = await db.focusarea.update({
    where: { id },
    data: {
      ...focusareaData,
      descriptionEn: "", // Default value for required field
      descriptionAr: "", // Default value for required field
      cards: {
        deleteMany: {},
        create: cards,
      },
    },
    include: {
      cards: true,
    },
  })

  revalidatePath("/admin/pages/focusareas")
  return updatedFocusarea
}

export async function deleteFocusarea(id: string) {
  await db.focusarea.delete({
    where: { id },
  })

  revalidatePath("/admin/pages/focusareas")
}

