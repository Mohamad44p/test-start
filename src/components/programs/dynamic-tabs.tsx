'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import { FaqProvider } from '@/context/FaqContext'
import { FAQSection } from '@/components/faq-section/faq-section'
import type { ProgramTab, FaqCategory } from '@prisma/client'

interface DynamicTabsProps {
  tabs: ProgramTab[];
  lang: string;
  faqCategories: FaqCategory[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  faqsByCategory: Record<string, any[]>;
}

export default function DynamicTabs({ tabs, lang, faqCategories, faqsByCategory }: DynamicTabsProps) {
  const [activeTab, setActiveTab] = React.useState(tabs[0]?.slug || '')

  React.useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash && tabs.some(tab => tab.slug === hash)) {
      setActiveTab(hash)
      setTimeout(() => {
        const element = document.getElementById(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }, [tabs])

  if (!tabs.length) return null;

  const allTabs = [
    ...tabs,
    {
      slug: 'faqs',
      title_en: 'FAQs',
      title_ar: 'الأسئلة الشائعة',
      content_en: '',
      content_ar: '',
    }
  ]

  return (
    <div className='flex-grow bg-gray-50'>
      <motion.div
        className='container mx-auto h-full'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="flex md:flex-row flex-col items-baseline h-full"
        >
          <div className="md:w-64 w-full sticky top-20">
            <TabsList className='flex md:flex-col flex-row md:items-stretch items-center md:justify-start justify-start md:space-y-2 md:space-x-0 space-x-2 p-4 min-w-max md:min-w-0 bg-white/80 backdrop-blur-sm'>
              {allTabs.map((tab) => (
                <TabsTrigger
                  key={tab.slug}
                  value={tab.slug}
                  className="flex-shrink-0 md:w-full px-4 py-2 md:py-3 text-center transition-all duration-200 ease-in-out
                           text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900
                           data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                           data-[state=active]:shadow-md rounded-md whitespace-nowrap md:whitespace-normal"
                >
                  {lang === 'ar' ? tab.title_ar : tab.title_en}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className='flex-grow overflow-auto p-4 md:p-6'>
            {tabs.map((tab) => (
              <TabsContent key={tab.slug} value={tab.slug}>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: lang === 'ar' ? tab.content_ar : tab.content_en 
                  }} 
                />
              </TabsContent>
            ))}
            
            <TabsContent value="faqs">
              <FaqProvider>
                <FAQSection 
                  categories={faqCategories} 
                  faqsByCategory={faqsByCategory}
                />
              </FaqProvider>
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </div>
  )
}
