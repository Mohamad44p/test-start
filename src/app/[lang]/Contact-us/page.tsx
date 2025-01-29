import { ContactAnimation } from "@/components/Contact-us/contact-animation"
import { ContactForm } from "@/components/Contact-us/contact-form"
import { SocialLinks } from "@/components/Contact-us/social-links"
import { MapPin, Phone, Mail } from "lucide-react"


export const dynamic = "force-dynamic"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1b316e] to-[#1b316e]">
            Get in Touch
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-center text-gray-600 mb-12">
          We&apos;re here to help and answer any question you might have
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-3 space-y-8">
            <ContactForm />
          </div>

          <div className="lg:col-span-2 space-y-8">
            <ContactAnimation />
            <div className="space-y-4">
              {[
                {
                  icon: MapPin,
                  text: "Haifa Building 4th floor, Al Irsal, Ramallah-AlBireh, Palestine",
                },
                { icon: Phone, text: "+970 2 296 4840" },
                { icon: Mail, text: "info@techstart.ps" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 bg-gradient-to-r from-[#24386F] to-[#872996] text-white rounded-lg shadow-md"
                >
                  <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
            <SocialLinks />
          </div>
        </div>
      </div>
    </div>
  )
}

