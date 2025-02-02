import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ProgramTab } from "@/types/program-tab"
import DisplayProgramTabs from "@/components/admin/program-tap/DisplayProgramTabs"

export const dynamic = "force-dynamic";

async function fetchProgramTabs(): Promise<ProgramTab[] | null> {
  try {
    const db = (await import("@/app/db/db")).default
    const programTabs = await db.programTab.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
    return programTabs
  } catch (error) {
    console.error("Failed to fetch program tabs:", error)
    return null
  }
}

export default async function ProgramTabsPage() {
  const programTabs = await fetchProgramTabs()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Program Tabs</h1>
      <div className="mb-4">
        <Link href="/admin/program-tabs/create">
          <Button>Create New Program Tab</Button>
        </Link>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        {programTabs === null ? (
          <div className="text-red-500">
            Error: Unable to fetch program tabs. Please check your database connection.
          </div>
        ) : programTabs.length === 0 ? (
          <div>No program tabs found. Create a new one to get started.</div>
        ) : (
          <DisplayProgramTabs initialProgramTabs={programTabs} />
        )}
      </Suspense>
    </div>
  )
}