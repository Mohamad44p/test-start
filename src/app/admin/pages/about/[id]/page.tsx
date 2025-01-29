import { getAboutUsById } from '@/app/actions/pages/about-us-actions'
import { AboutUsForm } from '@/components/admin/about/about-us-form'
import { notFound } from 'next/navigation'

export default async function EditAboutUsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const aboutUs = await getAboutUsById(params.id)

  if (!aboutUs) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit About Us</h1>
      <AboutUsForm initialData={aboutUs} />
    </div>
  )
}

