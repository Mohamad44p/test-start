/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { FaqProvider } from "@/context/FaqContext";
import { FAQSection } from "@/components/faq-section/faq-section";
import type { ProgramTab, FaqCategory } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

interface DynamicTabsProps {
  tabs: ProgramTab[];
  lang: string;
  faqCategories: FaqCategory[];
  faqsByCategory: Record<string, any[]>;
}

export default function DynamicTabs({
  tabs,
  lang,
  faqCategories,
  faqsByCategory,
}: DynamicTabsProps) {
  const { currentLang } = useLanguage();
  const [activeTab, setActiveTab] = React.useState(tabs[0]?.slug || "");

  React.useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && tabs.some((tab) => tab.slug === hash)) {
      setActiveTab(hash);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [tabs]);

  if (!tabs.length) return null;

  const allTabs = [
    ...tabs,
    {
      slug: "faqs",
      title_en: "FAQs",
      title_ar: "الأسئلة الشائعة",
      content_en: "",
      content_ar: "",
    },
  ];

  const buttonText = {
    eligibility: {
      en: "Eligibility Criteria",
      ar: "معايير الأهلية",
    },
    overview: {
      en: "Grant Overview",
      ar: "نظرة عامة على المنحة",
    },
    apply: {
      en: "APPLY HERE",
      ar: "تقدم الآن",
    },
    availability: {
      en: "The provision of this grant is subject to fund availability.",
      ar: "يخضع تقديم هذه المنحة لتوفر التمويل.",
    },
  };

  return (
    <div className="flex-grow bg-gradient-to-b py-[3rem] from-gray-50 to-white">
      <motion.div
        className="container mx-auto h-full pt-8 pb-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col lg:flex-row items-start h-full gap-6"
        >
          <div className="lg:w-80 w-full">
            <div
              className="sm:sticky sm:top-0 z-10 rounded-xl shadow-lg overflow-hidden 
                          backdrop-blur-md bg-white/90 border border-gray-100"
            >
              <TabsList className="flex lg:flex-col flex-row h-auto overflow-y-auto custom-scrollbar">
                <div className="flex lg:flex-col flex-row lg:items-stretch items-center w-full p-3 gap-2.5">
                  {allTabs.map((tab) => (
                    <TabsTrigger
                      key={tab.slug}
                      value={tab.slug}
                      className="group flex items-center w-full px-4 py-4 text-start transition-all duration-300
                               text-sm font-medium text-gray-600
                               data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#1C6AAF] data-[state=active]:to-[#872996]
                               data-[state=active]:text-white rounded-lg
                               hover:bg-gradient-to-r hover:from-[#1C6AAF]/5 hover:to-[#872996]/5
                               focus:outline-none focus:ring-2 focus:ring-[#1C6AAF]/50
                               relative overflow-hidden"
                    >
                      <motion.div
                        className="relative flex items-center gap-3 w-full"
                        whileHover={{ x: 3 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-current opacity-60" />
                        <span
                          className="truncate max-w-[200px]"
                          title={lang === "ar" ? tab.title_ar : tab.title_en}
                        >
                          {lang === "ar" ? tab.title_ar : tab.title_en}
                        </span>
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-[#1C6AAF]/10 to-[#872996]/10 
                                      opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                        />
                      </motion.div>
                    </TabsTrigger>
                  ))}
                </div>
              </TabsList>
            </div>
          </div>

          <div
            className="flex-grow w-full lg:max-w-[calc(100%-21rem)] bg-white rounded-xl 
                         shadow-lg p-8 border border-gray-100"
          >
            {tabs.map((tab) => (
              <TabsContent
                key={tab.slug}
                value={tab.slug}
                className="[&[data-state=active]]:animate-in [&[data-state=active]]:fade-in-50"
              >
                <div className="prose max-w-none">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: lang === "ar" ? tab.content_ar : tab.content_en,
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button
                    variant="outline"
                    className="hover:bg-gradient-to-r hover:from-[#1C6AAF]/10 hover:to-[#872996]/10 
                             transition-all duration-300 border-gray-200"
                  >
                    {currentLang === "ar"
                      ? buttonText.eligibility.ar
                      : buttonText.eligibility.en}
                  </Button>
                  <Button
                    variant="outline"
                    className="hover:bg-gradient-to-r hover:from-[#1C6AAF]/10 hover:to-[#872996]/10 
                             transition-all duration-300 border-gray-200"
                  >
                    {currentLang === "ar"
                      ? buttonText.overview.ar
                      : buttonText.overview.en}
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-[#1C6AAF] to-[#872996] hover:opacity-90 
                             transition-opacity shadow-lg hover:shadow-xl"
                  >
                    {currentLang === "ar"
                      ? buttonText.apply.ar
                      : buttonText.apply.en}
                  </Button>
                </div>
                <p className="text-sm text-gray-500 italic">
                  {currentLang === "ar"
                    ? buttonText.availability.ar
                    : buttonText.availability.en}
                </p>
              </TabsContent>
            ))}

            <TabsContent value="faqs">
              <FaqProvider>
                <FAQSection
                  categories={faqCategories}
                  faqsByCategory={faqsByCategory}
                />
              </FaqProvider>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="outline"
                  className="hover:bg-gradient-to-r hover:from-[#1C6AAF]/10 hover:to-[#872996]/10 
                           transition-all duration-300 border-gray-200"
                >
                  {currentLang === "ar"
                    ? buttonText.eligibility.ar
                    : buttonText.eligibility.en}
                </Button>
                <Button
                  variant="outline"
                  className="hover:bg-gradient-to-r hover:from-[#1C6AAF]/10 hover:to-[#872996]/10 
                           transition-all duration-300 border-gray-200"
                >
                  {currentLang === "ar"
                    ? buttonText.overview.ar
                    : buttonText.overview.en}
                </Button>
                <Button
                  className="bg-gradient-to-r from-[#1C6AAF] to-[#872996] hover:opacity-90 
                           transition-opacity shadow-lg hover:shadow-xl"
                >
                  {currentLang === "ar"
                    ? buttonText.apply.ar
                    : buttonText.apply.en}
                </Button>
              </div>
              <p className="text-sm text-gray-500 italic">
                {currentLang === "ar"
                  ? buttonText.availability.ar
                  : buttonText.availability.en}
              </p>
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </div>
  );
}
