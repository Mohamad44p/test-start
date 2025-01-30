import { Suspense } from "react"
import { ContactAnimation } from "@/components/Contact-us/contact-animation"
import { ContactForm } from "@/components/Contact-us/contact-form"
import { SocialLinks } from "@/components/Contact-us/social-links"
import { getFooter } from "@/app/actions/pages/footerActions"
import { ContactInfo } from "@/components/Contact-us/contact-info"

export const dynamic = "force-dynamic"

export default async function ContactPage() {
  const { data: footerData } = await getFooter()

  const socialLinksData = footerData ? {
    facebook: footerData.facebook || undefined,
    instagram: footerData.instagram || undefined,
    linkedin: footerData.linkedin || undefined,
    twitter: footerData.twitter || undefined,
    youtube: footerData.youtube || undefined,
  } : null

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1b316e] to-[#1b316e] dark:from-[#3b5998] dark:to-[#3b5998]">
            Get in Touch
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-center text-gray-600 dark:text-gray-300 mb-12">
          We&apos;re here to help and answer any question you might have
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-3 space-y-8">
            <Suspense fallback={<div>Loading form...</div>}>
              <ContactForm />
            </Suspense>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <ContactAnimation />
            <ContactInfo />
            <SocialLinks socialLinks={socialLinksData} />
          </div>
        </div>
      </div>
    </div>
  )
}

