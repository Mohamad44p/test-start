import { getProgramsWithHero } from "@/app/actions/program-actions"
import ProgramsSec from "./ProgramsSec"
import type { Program } from "@/types/program"

export default async function ProgramsWrapper() {
  const response = await getProgramsWithHero()

  if (!response.success || !response.data) {
    console.error("Failed to fetch programs:", response.error)
    return <div>Error loading programs</div>
  }

  const programs: Program[] = response.data.map((program) => ({
    id: program.id,
    name_en: program.name_en,
    name_ar: program.name_ar,
    description_en: program.description_en,
    description_ar: program.description_ar,
    imageUrl: program.imageUrl
  }))

  return <ProgramsSec programs={programs} />
}

