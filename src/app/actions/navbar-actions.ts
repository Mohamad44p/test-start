"use server"

import db from "@/app/db/db"
import type { ProgramCategory } from "@/types/program-tab"

interface NavbarProgramsResponse {
  success: boolean;
  categories: ProgramCategory[];
}

export async function getNavbarPrograms(): Promise<NavbarProgramsResponse> {
  try {
    const categories = await db.programCategory.findMany({
      where: {
        programs: {
          some: {} // Only get categories that have programs
        }
      },
      include: {
        programs: {
          include: {
            ProgramTab: {
              select: {
                id: true,
                title_en: true,
                title_ar: true,
                slug: true
              }
            }
          }
        }
      },
      orderBy: {
        order: 'asc'
      }
    });

    return { 
      success: true, 
      categories
    };
  } catch (error) {
    console.error("Error fetching navbar programs:", error);
    return { success: false, categories: [] };
  }
}
