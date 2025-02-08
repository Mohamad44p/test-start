"use client"

import LayoutAd from "@/components/admin/LayoutAd"
import { Toaster } from "@/components/ui/toaster"
import React from "react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LayoutAd>{children}</LayoutAd>
      <Toaster />
    </>
  )
}
