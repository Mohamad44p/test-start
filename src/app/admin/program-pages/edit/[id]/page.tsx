import db from "@/app/db/db"
import ProgramPageForm from "@/components/admin/program-tap/ProgramPageForm"

export default async function EditProgramPagePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const programPage = await db.programPage.findUnique({
    where: { id: params.id },
  })

  if (!programPage) {
    return <div>Program page not found</div>
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Program Page</h1>
      <ProgramPageForm programPage={programPage} />
    </div>
  )
}

