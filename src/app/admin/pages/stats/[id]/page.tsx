import { getStat } from "@/app/actions/pages/statActions"
import { StatEditForm } from "@/components/admin/pages/StatEditForm"
import { notFound } from "next/navigation"

export default async function EditStatPage({ params }: { params: { id: string } }) {
  const response = await getStat(params.id)

  if (!response.success) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 lg:px-8">
      <StatEditForm stat={response.data} />
    </div>
  )
}
