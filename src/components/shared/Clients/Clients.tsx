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
          {/* Titles */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-base md:text-lg text-[#1b316e] font-semibold"
            >
              {currentLang === "ar" ? "مشروع من" : "A Project of"}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-base md:text-lg text-[#1b316e] font-semibold"
            >
              {currentLang === "ar" ? "بتمويل من" : "Funded By"}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-base md:text-lg text-[#1b316e] font-semibold"
            >
              {currentLang === "ar" ? "تنفيذ" : "Implemented By"}
            </motion.span>
          </div>

          {/* Logos Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
            {/* Project Partners */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full md:w-[200px]"
            >
              <div className="flex md:block overflow-x-auto gap-4 pb-4 md:pb-0">
                {projectPartners.map((partner, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 min-w-[150px] md:min-w-0 md:mb-4"
                  >
                    <div className="relative h-[80px]">
                      <Image
                        src={partner.imageUrl || "/placeholder.svg"}
                        alt={currentLang === "ar" ? partner.name_ar : partner.name_en}
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Funded Partners */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-full md:flex-grow md:mx-8"
            >
              <div className="bg-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {fundedPartners.map((partner, index) => (
                    <div key={index} className="relative h-[60px] md:h-[80px]">
                      <Image
                        src={partner.imageUrl || "/placeholder.svg"}
                        alt={currentLang === "ar" ? partner.name_ar : partner.name_en}
                        fill
                        className="object-contain"
                        priority={index < 2}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Implemented Partners */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full md:w-[200px]"
            >
              <div className="flex md:block overflow-x-auto gap-4 pb-4 md:pb-0">
                {implementedPartners.map((partner, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 min-w-[150px] md:min-w-0 md:mb-4"
                  >
                    <div className="relative h-[80px]">
                      <Image
                        src={partner.imageUrl || "/placeholder.svg"}
                        alt={currentLang === "ar" ? partner.name_ar : partner.name_en}
                        fill
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
    </section>
  )
}

export default Clients

