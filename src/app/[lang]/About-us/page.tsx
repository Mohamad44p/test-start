import { getAboutUs } from "@/app/actions/pages/about-us-actions"
import { getFocusareas } from "@/app/actions/pages/focusareas-actions"
import { getTeamMembers } from "@/app/actions/pages/team-actions"
import AboutUsContent from "@/components/who-we-are/about-us-content"

export const dynamic = "force-dynamic"


export default async function AboutPage() {
  const aboutUsData = await getAboutUs()
  const focusareasData = await getFocusareas()
  const teamMembersData = await getTeamMembers()

  if (!aboutUsData || !focusareasData || !teamMembersData) {
    return <div>Error loading data</div>
  }

  return <AboutUsContent aboutUsData={aboutUsData} focusareasData={focusareasData} teamMembersData={teamMembersData} />
}

