"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { FaqProvider } from "@/context/FaqContext";
import { FAQSection } from "@/components/faq-section/faq-section";
import type { ProgramTab as PrismaProgramTab, FaqCategory, FaqItem, ProgramsPages as PrismaProgram } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { useMediaQuery } from "@/lib/use-media-query";
import { TabButtonDialog } from "./tab-button-dialog";
import type { TabButton } from "@/types/program-tab";

interface ExtendedProgramTab extends Omit<PrismaProgramTab, 'buttons'> {
  buttons: TabButton[];
  programPage?: PrismaProgram | null;
}

interface DynamicTabsProps {
  tabs: ExtendedProgramTab[];
  lang: string;
  faqCategories: FaqCategory[];
  faqsByCategory: Record<string, FaqItem[]>;
}

export default function DynamicTabs({ tabs, lang, faqCategories, faqsByCategory }: DynamicTabsProps): JSX.Element {
  const { currentLang } = useLanguage();
  const [activeTab, setActiveTab] = React.useState(tabs[0]?.slug || "");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState<{ title: string; content: string } | null>(null);

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

  if (!tabs.length) return <></>;

  const allTabs = [
    ...tabs,
    {
      id: "faqs",
      slug: "faqs",
      title_en: "FAQs",
      title_ar: "الأسئلة الشائعة",
      content_en: "",
      content_ar: "",
      buttons: [],
      processFile: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      programPageId: null,
    } as ExtendedProgramTab,
  ];

  const buttonText = {
    overview: {
      en: "Application Process Details",
      ar: "تفاصيل عملية التقديم",
    },
    apply: {
      en: "APPLY HERE",
      ar: "تقدم الآن",
    },
    availability: {
      en: "The provision of this grant is subject to fund availability.",
      ar: "يخضع تقديم هذه المنحة لتوفر التمويل.",
    },
    eligibility: {
      en: "Eligibility Criteria",
      ar: "معايير الأهلية",
    }
  };

  const handleProcessDetailsClick = (tab: ExtendedProgramTab) => {
    if (tab.processFile) {
      window.open(tab.processFile, "_blank");
    }
  };

  const renderTabContent = (tab: ExtendedProgramTab) => (
    <div className="space-y-6">
      <div className="prose max-w-none">
        <div
          dangerouslySetInnerHTML={{
            __html: lang === "ar" ? tab.content_ar : tab.content_en,
          }}
        />
      </div>

      {tab.buttons && tab.buttons.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {tab.buttons.map((button) => (
            <Button
              key={button.id}
              variant="outline"
              className="w-full text-center p-4 h-auto"
              onClick={() => {
                setSelectedButton({
                  title: currentLang === "ar" ? button.name_ar : button.name_en,
                  content: currentLang === "ar" ? button.content_ar : button.content_en,
                });
                setIsDialogOpen(true);
              }}
            >
              {currentLang === "ar" ? button.name_ar : button.name_en}
            </Button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        {/* Eligibility Criteria Button */}
        {tab.programPageId && (
          <Link href={`/${currentLang}/programs/${tab.programPageId}/eligibility`}>
            <Button variant="outline" className="hover:bg-gradient-to-r hover:from-[#1C6AAF]/10 hover:to-[#872996]/10 
                   transition-all duration-300 border-gray-200">
              {currentLang === "ar" ? buttonText.eligibility.ar : buttonText.eligibility.en}
            </Button>
          </Link>
        )}
        
        <Button
          variant="outline"
          className="hover:bg-gradient-to-r hover:from-[#1C6AAF]/10 hover:to-[#872996]/10 
                   transition-all duration-300 border-gray-200"
          onClick={() => handleProcessDetailsClick(tab)}
          disabled={!tab.processFile}
        >
          {currentLang === "ar"
            ? buttonText.overview.ar
            : buttonText.overview.en}
        </Button>
        <Link href="https://fs20.formsite.com/DAIForms/smr0etmskv/login">
          <Button className="bg-gradient-to-r from-[#1C6AAF] to-[#872996] hover:opacity-90 
                         transition-opacity shadow-lg hover:shadow-xl">
            {currentLang === "ar"
              ? buttonText.apply.ar
              : buttonText.apply.en}
          </Button>
        </Link>
      </div>
      <p className="text-sm text-gray-500 italic">
        {currentLang === "ar"
          ? buttonText.availability.ar
          : buttonText.availability.en}
      </p>
    </div>
  );

  return (
    <div className="flex-grow bg-gradient-to-b py-[3rem] from-gray-50 to-white">
      <motion.div
        className="container mx-auto h-full pt-8 pb-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {isMobile ? (
          <Accordion type="single" collapsible className="w-full space-y-4">
            {allTabs.map((tab) => (
              <AccordionItem key={tab.slug} value={tab.slug}>
                <AccordionTrigger className="text-lg font-semibold hover:bg-gradient-to-r hover:from-[#1C6AAF]/5 hover:to-[#872996]/5 px-4 py-2 rounded-lg transition-all duration-300">
                  {lang === "ar" ? tab.title_ar : tab.title_en}
                </AccordionTrigger>
                <AccordionContent className="px-4 py-6">
                  {tab.slug === "faqs" ? (
                    <FaqProvider>
                      <FAQSection
                        categories={faqCategories.map((category) => ({
                          ...category,
                          faqs: faqsByCategory[category.id] || [],
                        }))}
                        faqsByCategory={faqsByCategory}
                      />
                    </FaqProvider>
                  ) : (
                    renderTabContent(tab as ExtendedProgramTab)
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex flex-col lg:flex-row items-start h-full gap-6"
          >
            <div className="lg:w-96 w-full">
              <div
                className="sticky top-4 z-10 rounded-xl shadow-lg overflow-hidden 
                            backdrop-blur-md bg-white/90 border border-gray-100"
              >
                <TabsList
                  className="flex flex-col h-auto overflow-y-auto custom-scrollbar 
                                   scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                >
                  <div className="flex flex-col items-stretch w-full p-3 gap-2.5">
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
                          <span className="flex-grow text-left">
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
              className="flex-grow w-full lg:max-w-[calc(100%-25rem)] bg-white rounded-xl 
                           shadow-lg p-8 border border-gray-100"
            >
              {tabs.map((tab) => (
                <TabsContent
                  key={tab.slug}
                  value={tab.slug}
                  className="[&[data-state=active]]:animate-in [&[data-state=active]]:fade-in-50"
                >
                  {renderTabContent(tab)}
                </TabsContent>
              ))}

              <TabsContent value="faqs">
                <FaqProvider>
                  <FAQSection
                    categories={faqCategories.map((category) => ({
                      ...category,
                      faqs: faqsByCategory[category.id] || [],
                    }))}
                    faqsByCategory={faqsByCategory}
                  />
                </FaqProvider>
              </TabsContent>
            </div>
          </Tabs>
        )}
      </motion.div>
      <TabButtonDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={selectedButton?.title || ""}
        content={selectedButton?.content || ""}
      />
    </div>
  );
}