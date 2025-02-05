"use server"

import db from "@/app/db/db"

export async function getNavbarPrograms() {
  try {
    const programs = await db.programsPages.findMany({
      include: {
        ProgramTab: {
          select: {
            id: true,
            title_en: true,
            title_ar: true,
            slug: true,
          }
        }
      }
    })
    
    return { success: true, programs }
  } catch (error) {
    console.error("Failed to fetch navbar programs:", error)
    return { error: "Failed to fetch programs", programs: [] }
  }
}
