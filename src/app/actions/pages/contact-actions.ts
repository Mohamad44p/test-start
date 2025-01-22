'use server'

import db from '@/app/db/db'
import { revalidatePath } from 'next/cache'

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface ContactSubmission extends ContactFormData {
  id: string
  createdAt: Date
}

export async function submitContactForm(data: ContactFormData): Promise<ContactSubmission> {
  const submission = await db.contactSubmission.create({
    data,
  })

  revalidatePath('/admin/contact-submissions')
  return submission
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  return db.contactSubmission.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export async function deleteContactSubmission(id: string): Promise<void> {
  await db.contactSubmission.delete({
    where: { id },
  })

  revalidatePath('/admin/contact-submissions')
}
