"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { DropdownProps } from "@/types/navbar";
import { getNavbarPrograms } from "@/app/actions/navbar-actions";
import { useLanguage } from "@/context/LanguageContext";
import type { ProgramCategory } from "@/types/program-tab";

export const ProgramsDropdown: React.FC<DropdownProps> = ({ setPosition, translations }) => {
  const { currentLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeProgramId, setActiveProgramId] = useState<string | null>(null);
  const [categories, setCategories] = useState<ProgramCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef<null | HTMLLIElement>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const result = await getNavbarPrograms();
        if (result.success && result.categories) {
          setCategories(result.categories);
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref?.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
        setIsOpen(true);
      }}
      onMouseLeave={() => {
        setIsOpen(false);
        setActiveCategory(null);
        setActiveProgramId(null);
      }}
      className="relative z-10 block cursor-pointer px-3 py-1.5 text-base font-medium text-[#1b316e] transition-colors hover:text-white"
    >
      {translations.programs}
      <AnimatePresence>
        {isOpen && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="absolute left-0 mt-2 w-80 rounded-xl bg-white/90 backdrop-blur-md shadow-lg shadow-purple-500/20 border border-purple-100/20 overflow-hidden"
          >
            <div className="py-1">
              {categories.map((category) => (
                <div key={category.id} className="border-b border-gray-100 last:border-none">
                  <button
                    onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                    className="w-full px-4 py-3 text-sm font-medium text-[#1b316e] hover:bg-gray-50 
                             flex items-center justify-between transition-all"
                  >
                    <span>{currentLang === "ar" ? category.name_ar : category.name_en}</span>
                    <motion.span
                      animate={{ rotate: activeCategory === category.id ? 180 : 0 }}
                      className="text-xs opacity-50"
                    >
                      ▼
                    </motion.span>
                  </button>
                  
                  <AnimatePresence>
                    {activeCategory === category.id && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-gray-50"
                      >
                        {category.programs?.map((program) => (
                          <div key={program.id}>
                            <button
                              onClick={() => setActiveProgramId(activeProgramId === program.id ? null : program.id)}
                              className="w-full px-6 py-2.5 text-sm text-[#1b316e] hover:bg-gray-100
                                       flex items-center justify-between transition-all"
                            >
                              <span>{currentLang === "ar" ? program.name_ar : program.name_en}</span>
                              {program.ProgramTab && program.ProgramTab.length > 0 && (
                                <motion.span
                                  animate={{ rotate: activeProgramId === program.id ? 180 : 0 }}
                                  className="text-xs opacity-50"
                                >
                                  ▼
                                </motion.span>
                              )}
                            </button>

                            <AnimatePresence>
                              {activeProgramId === program.id && program.ProgramTab && (
                                <motion.div
                                  initial={{ height: 0 }}
                                  animate={{ height: "auto" }}
                                  exit={{ height: 0 }}
                                  className="bg-white"
                                >
                                  {program.ProgramTab.map((tab) => (
                                    <Link
                                      key={tab.id}
                                      href={`/${currentLang}/programs/${program.id}#${tab.slug}`}
                                      className="block px-8 py-2 text-sm text-[#1b316e] hover:bg-gray-100"
                                    >
                                      {currentLang === "ar" ? tab.title_ar : tab.title_en}
                                    </Link>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};
