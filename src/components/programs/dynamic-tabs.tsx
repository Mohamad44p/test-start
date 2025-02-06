/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { FaqProvider } from "@/context/FaqContext"
import { FAQSection } from "@/components/faq-section/faq-section"
import type { ProgramTab, FaqCategory } from "@prisma/client"
import { Button } from "@/components/ui/button"

interface DynamicTabsProps {
  tabs: ProgramTab[]
  lang: string
  faqCategories: FaqCategory[]
  faqsByCategory: Record<string, any[]>
}

export default function DynamicTabs({ tabs, lang, faqCategories, faqsByCategory }: DynamicTabsProps) {
  const [activeTab, setActiveTab] = React.useState(tabs[0]?.slug || "")

  React.useEffect(() => {
    const hash = window.location.hash.replace("#", "")
    if (hash && tabs.some((tab) => tab.slug === hash)) {
      setActiveTab(hash)
      setTimeout(() => {
        const element = document.getElementById(hash)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    }
  }, [tabs])

  if (!tabs.length) return null

  const allTabs = [
    ...tabs,
    {
      slug: "faqs",
      title_en: "FAQs",
      title_ar: "الأسئلة الشائعة",
      content_en: "",
      content_ar: "",
    },
  ]

  return (
    <div className="flex-grow bg-gray-50">
      <motion.div className="container mx-auto h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col lg:flex-row items-start h-full">
          <div className="lg:w-64 w-full sticky top-20 z-10 bg-white/80 backdrop-blur-sm">
            <TabsList className="flex lg:flex-col flex-row lg:items-stretch items-center lg:justify-start justify-start lg:space-y-2 lg:space-x-0 space-x-2 p-4 overflow-x-auto lg:overflow-x-visible">
              {allTabs.map((tab) => (
                <TabsTrigger
                  key={tab.slug}
                  value={tab.slug}
                  className="flex-shrink-0 lg:w-full px-4 py-2 lg:py-3 text-center transition-all duration-200 ease-in-out
                           text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900
                           data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                           data-[state=active]:shadow-md rounded-md whitespace-nowrap lg:whitespace-normal"
                >
                  {lang === "ar" ? tab.title_ar : tab.title_en}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="flex-grow overflow-auto p-4 lg:p-6 w-full">
            {tabs.map((tab) => (
              <TabsContent key={tab.slug} value={tab.slug} className="mt-0">
                <div className="prose max-w-none mb-8">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: lang === "ar" ? tab.content_ar : tab.content_en,
                    }}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button variant="outline">Eligibility Criteria</Button>
                  <Button variant="outline">Grant Overview</Button>
                  <Button variant="default">APPLY HERE</Button>
                </div>
                <p className="text-sm text-gray-500 italic">
                  The provision of this grant is subject to fund availability.
                </p>
              </TabsContent>
            ))}

            <TabsContent value="faqs" className="mt-0">
              <FaqProvider>
                <FAQSection categories={faqCategories} faqsByCategory={faqsByCategory} />
              </FaqProvider>
              <div className="flex flex-col sm:flex-row gap-4 mt-8 mb-8">
                <Button variant="outline">Eligibility Criteria</Button>
                <Button variant="outline">Grant Overview</Button>
                <Button variant="default">APPLY HERE</Button>
              </div>
              <p className="text-sm text-gray-500 italic">
                The provision of this grant is subject to fund availability.
              </p>
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </div>
  )
}

