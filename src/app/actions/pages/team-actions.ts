"use server"

import db from "@/app/db/db"
import { revalidatePath } from "next/cache"

export type TeamMemberData = {
  nameEn: string
  nameAr: string
  jobTitleEn: string
  jobTitleAr: string
  imageUrl: string
}

export async function getTeamMembers() {
  return db.teamMember.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export async function getTeamMemberById(id: string) {
  return db.teamMember.findUnique({
    where: { id },
  })
}

export async function createTeamMember(data: TeamMemberData) {
  const createdTeamMember = await db.teamMember.create({
    data,
  })

  revalidatePath("/admin/pages/team")
  return createdTeamMember
}

export async function updateTeamMember(id: string, data: TeamMemberData) {
  const updatedTeamMember = await db.teamMember.update({
    where: { id },
    data,
  })

  revalidatePath("/admin/pages/team")
  return updatedTeamMember
}

export async function deleteTeamMember(id: string) {
  await db.teamMember.delete({
    where: { id },
  })

  revalidatePath("/admin/pages/team")
}

