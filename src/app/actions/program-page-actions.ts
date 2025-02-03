"use server"

import db from "@/app/db/db"

export async function getPrograms() {
  try {
    const programs = await db.programsPages.findMany({
      include: {
        ProgramsHero: true,
        ProgramTab: true
      }
    })
    return { success: true, programs }
  } catch (error) {
    console.error("Failed to fetch programs:", error)
    return { error: "Failed to fetch programs" }
  }
}

export async function getProgramBySlug(slug: string) {
  try {
    const program = await db.programsPages.findFirst({
      where: { id: slug },
      include: {
        ProgramsHero: true,
        ProgramTab: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })
    return { success: true, program }
  } catch (error) {
    console.error("Failed to fetch program:", error)
    return { error: "Failed to fetch program" }
  }
}
