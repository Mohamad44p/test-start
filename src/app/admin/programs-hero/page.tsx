import { Suspense } from "react"
import { ProgramsHero } from "@/types/programs-hero"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ProgramsHeroForm from "@/components/admin/program-tap/ProgramsHeroForm"

export const dynamic = "force-dynamic";


async function fetchProgramsHero(): Promise<ProgramsHero | null> {
  try {
    const db = (await import("@/app/db/db")).default
    const programsHero = await db.programsHero.findFirst()
    return programsHero
  } catch (error) {
    console.error("Failed to fetch programs hero:", error)
    return null
  }
}

export default async function ProgramsHeroPage() {
  const programsHero = await fetchProgramsHero()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Programs Hero</h1>
      <Suspense fallback={<div>Loading...</div>}>
        {programsHero === null ? (
          <div>
            <p className="text-red-500 mb-4">
              No Programs Hero found. Would you like to create one?
            </p>
            <Link href="/admin/programs-hero/create">
              <Button>Create Programs Hero</Button>
            </Link>
          </div>
        ) : (
          <ProgramsHeroForm programsHero={programsHero} />
        )}
      </Suspense>
    </div>
  )
}