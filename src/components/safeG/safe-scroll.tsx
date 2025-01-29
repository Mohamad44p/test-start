"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll } from "framer-motion"
import { SafeAnimation } from "./safe-animation"
import type { Safeguard } from "@/types/safeguard"
import { useLanguage } from "@/context/LanguageContext"

interface SafeScrollProps {
  safeguards: Safeguard[]
}

const handleDownload = async (url: string, filename: string) => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'document'
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error('Download failed:', error)
  }
}

export function SafeScroll({ safeguards }: SafeScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const { currentLang } = useLanguage()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      const newIndex = Math.floor(latest * safeguards.length)
      if (newIndex !== currentIndex && newIndex < safeguards.length) {
        setCurrentIndex(newIndex)
      }
    })

    return () => unsubscribe()
  }, [scrollYProgress, currentIndex, safeguards.length])

  return (
    <div ref={containerRef} className="relative">
      {safeguards.map((safeguard, index) => (
        <div key={index} className="h-screen flex items-center justify-center sticky top-0">
          <motion.div
            className="w-full h-full absolute inset-0"
            style={{ background: `linear-gradient(to bottom right, ${safeguard.bgColor}, ${safeguard.bgColor}cc)` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: currentIndex === index ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          />
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between relative z-10">
            <div className="w-full md:w-1/2 mb-8 md:mb-0">
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: currentIndex === index ? 1 : 0,
                  y: currentIndex === index ? 0 : 20,
                }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span className="text-gray-600 text-lg font-semibold">{safeguard.domain}</span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
                  {currentLang === "ar" ? safeguard.title_ar : safeguard.title_en}
                </h2>
                <p className="text-lg text-gray-600">
                  {currentLang === "ar" ? safeguard.tagline_ar : safeguard.tagline_en}
                </p>
                <p className="text-base text-gray-700">
                  {currentLang === "ar" ? safeguard.description_ar : safeguard.description_en}
                </p>
                {safeguard.attachmentUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <button
                      onClick={() => {
                        const filename = safeguard.attachmentUrl?.split('/').pop() || 'document'
                        handleDownload(`/api/download?url=${encodeURIComponent(safeguard.attachmentUrl!)}`, filename)
                      }}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      {currentLang === "ar" ? "تحميل المستند" : "Download Document"}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </div>
            <div className="w-full md:w-1/2">
              <SafeAnimation imageUrl={safeguard.imageUrl} index={index} currentIndex={currentIndex} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

