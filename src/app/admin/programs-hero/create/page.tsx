import ProgramsHeroForm from "@/components/admin/program-tap/ProgramsHeroForm"
import db from "@/app/db/db"

export default async function CreateProgramsHeroPage() {
  const programs = await db.programsPages.findMany()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Create Programs Hero</h1>
      <ProgramsHeroForm programs={programs} />
    </div>
  )
}

