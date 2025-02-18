import { getStat } from "@/app/actions/pages/statActions"
import { StatFormUnified } from "@/components/admin/pages/StatFormUnified"
import { notFound } from "next/navigation"

export default async function EditStatPage({ params }: { params: { id: string } }) {
  const response = await getStat(params.id)

  if (!response.success) {
    notFound()
  }

  return <StatFormUnified mode="edit" stat={response.data} />
}
