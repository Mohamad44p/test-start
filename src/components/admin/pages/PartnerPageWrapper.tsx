'use client'

import { useRouter } from "next/navigation"
import { PartnerPageForm } from "./PartnerPageForm"
import type { PartnerPageFormInput } from "@/lib/schema/partnerPageSchema"

interface PartnerPageWrapperProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any //
  action: (data: PartnerPageFormInput) => Promise<{ success: boolean; error?: string }>
  buttonText?: string
}

export function PartnerPageWrapper({ initialData, action, buttonText }: PartnerPageWrapperProps) {
  const router = useRouter()

  return (
    <PartnerPageForm
      initialData={initialData}
      submitAction={action}
      onSuccess={() => router.push('/admin/pages/partners')}
      buttonText={buttonText}
    />
  )
}
