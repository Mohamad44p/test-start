"use client"

import type React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useLanguage } from "@/context/LanguageContext"
import type { Partner } from "@/types/footer"

interface ClientsProps {
  partners: Partner[]
}

const Clients: React.FC<ClientsProps> = ({ partners }) => {
  const { currentLang } = useLanguage()

  const projectPartners = partners.filter((p) => p.type === "PROJECT_OF")
  const fundedPartners = partners.filter((p) => p.type === "FUNDED_BY")
  const implementedPartners = partners.filter((p) => p.type === "IMPLEMENTED_BY")

  return (
    <section className="relative px-4">
      <div className="container mx-auto">
        <div className="max-w-7xl mx-auto">
          <div className="md:hidden space-y-8">
            <div className="space-y-4">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="block text-base text-[#1b316e] font-semibold"
              >
                {currentLang === "ar" ? "مشروع من" : "A Project of"}
              </motion.span>
              <div className="flex flex-col gap-4">
                {projectPartners.map((partner, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative h-[80px]">
                      <Image
                        src={partner.imageUrl || "/placeholder.svg"}
                        alt={currentLang === "ar" ? partner.name_ar : partner.name_en}
                        fill
                        sizes="(max-width: 640px) 100vw, 640px"
                        className="object-contain"
                        priority
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="block text-base text-[#1b316e] font-semibold"
              >
                {currentLang === "ar" ? "بتمويل من" : "Funded By"}
              </motion.span>
              <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="grid grid-cols-2 gap-4">
                  {fundedPartners.map((partner, index) => (
                    <div key={index} className="relative h-[60px]">
                      <Image
                        src={partner.imageUrl || "/placeholder.svg"}
                        alt={currentLang === "ar" ? partner.name_ar : partner.name_en}
                        fill
                        sizes="(max-width: 640px) 100vw, 640px"
                        className="object-contain"
                        priority={index < 2}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="block text-base text-[#1b316e] font-semibold"
              >
                {currentLang === "ar" ? "تنفيذ" : "Implemented By"}
              </motion.span>
              <div className="flex flex-col gap-4">
                {implementedPartners.map((partner, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative h-[80px]">
                      <Image
                        src={partner.imageUrl || "/placeholder.svg"}
                        alt={currentLang === "ar" ? partner.name_ar : partner.name_en}
                        fill
                        sizes="(max-width: 640px) 100vw, 640px"
                        className="object-contain"
                        priority
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="flex justify-between items-center mb-6">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-lg text-[#1b316e] font-semibold"
              >
                {currentLang === "ar" ? "مشروع من" : "A Project of"}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-lg text-[#1b316e] font-semibold"
              >
                {currentLang === "ar" ? "بتمويل من" : "Funded By"}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-lg text-[#1b316e] font-semibold"
              >
                {currentLang === "ar" ? "تنفيذ" : "Implemented By"}
              </motion.span>
            </div>

            <div className="flex justify-between items-center">
              <motion.div className="w-[200px]">
                <div className="space-y-4">
                  {projectPartners.map((partner, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 md:mb-4"
                    >
                      <div className="relative h-[80px]">
                        <Image
                          src={partner.imageUrl || "/placeholder.svg"}
                          alt={currentLang === "ar" ? partner.name_ar : partner.name_en}
                          fill
                          sizes="(max-width: 640px) 100vw, 640px"
                          className="object-contain"
                          priority
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div className="flex-1 mx-8 mb-3">
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="grid grid-cols-3 lg:grid-cols-4 gap-6">
                    {fundedPartners.map((partner, index) => (
                      <div key={index} className="relative h-[80px]">
                        <Image
                          src={partner.imageUrl || "/placeholder.svg"}
                          alt={currentLang === "ar" ? partner.name_ar : partner.name_en}
                          fill
                          sizes="(max-width: 640px) 100vw, 640px"
                          className="object-contain"
                          priority={index < 2}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div className="w-[200px]">
                <div className="space-y-4">
                  {implementedPartners.map((partner, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 md:mb-4"
                    >
                      <div className="relative h-[80px]">
                        <Image
                          src={partner.imageUrl || "/placeholder.svg"}
                          alt={currentLang === "ar" ? partner.name_ar : partner.name_en}
                          fill
                          sizes="(max-width: 640px) 100vw, 640px"
                          className="object-contain"
                          priority
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Clients

