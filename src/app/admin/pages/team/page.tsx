import { columns } from "./columns"
import { teamTableConfig } from "./config"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/admin/Gallary/tabel/data-table"
import { getTeamMembers } from "@/app/actions/pages/team-actions"

export default async function TeamMembers() {
  const teamMembers = await getTeamMembers()

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Team Members</h1>
        <Link href="/admin/pages/team/create" passHref prefetch>
          <Button>Add New Team Member</Button>
        </Link>
      </div>
      <DataTable 
        columns={columns} 
        data={teamMembers} 
        config={teamTableConfig}
      />
    </div>
  )
}

