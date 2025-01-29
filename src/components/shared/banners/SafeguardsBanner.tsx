"use client"

import type React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/LanguageContext"
import type { Safeguard } from "@/types/safeguard"

interface SafeguardsBannerProps {
  safeguard: Safeguard
}

const SafeguardsBanner: React.FC<SafeguardsBannerProps> = ({ safeguard }) => {
  const { currentLang } = useLanguage()

  const title = currentLang === "ar" ? safeguard.title_ar : safeguard.title_en
  const description = currentLang === "ar" ? safeguard.description_ar : safeguard.description_en

  return (
    <div
      className={`relative max-w-7xl mx-auto my-[5vh] overflow-hidden text-gray-900 bg-gradient-to-br ${safeguard.bgColor}`}
    >
      <div className="absolute inset-0 bg-grid-gray-200/50 bg-[size:20px_20px]" />
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div
            className="w-full lg:w-1/2 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-[#142451]">{title}</h2>
            <p className="text-lg sm:text-xl text-[#142451] max-w-2xl">{description}</p>
            <div className="flex flex-wrap gap-4">
              {["ESMF", "SEP", "LMP", "ESCP"].map((item) => (
                <div key={item} className="bg-[#4169E1]/10 text-[#000080] rounded-lg px-3 py-1 text-sm font-medium">
                  {item}
                </div>
              ))}
            </div>
            <Link href="/safeguards" passHref>
              <Button
                size="lg"
                className="mt-4 bg-gradient-to-r from-[#142451] to-[#862996] text-white hover:from-[#142451]/80 hover:to-[#862996]/80"
              >
                {currentLang === "ar" ? "اعرف المزيد" : "Learn More"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4169E1]/20 to-[#000080]/20 rounded-full blur-3xl" />
              {safeguard.imageUrl ? (
                <div className="relative w-full h-full">
                  <Image
                    src={safeguard.imageUrl || "/placeholder.svg"}
                    alt={title}
                    fill
                    className="rounded-lg filter drop-shadow-lg object-cover"
                    placeholder="blur"
                    blurDataURL="/card-front.jpg"
                  />
                </div>
              ) : (
                <div>
                  <p
                    className="text-[#142451] text-center text-xl font-medium bg-[#4169E1]/10 rounded-lg p-4"
                  >
                    there is no image for this safeguard
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default SafeguardsBanner

