import { getStat } from "@/app/actions/pages/statActions"
import { StatEditForm } from "@/components/admin/pages/StatEditForm"
import { notFound } from "next/navigation"

export default async function EditStatPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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
