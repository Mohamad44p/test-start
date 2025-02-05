"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { DropdownProps, ProgramData } from "@/types/navbar";
import { getNavbarPrograms } from "@/app/actions/navbar-actions";
import { useLanguage } from "@/context/LanguageContext";

export const ProgramsDropdown: React.FC<DropdownProps> = ({ setPosition, translations }) => {
  const { currentLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [programs, setPrograms] = useState<ProgramData[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef<null | HTMLLIElement>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const { programs } = await getNavbarPrograms();
        if (programs) {
          setPrograms(programs);
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
        setActiveItem(null);
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
              {programs.map((program) => (
                <div key={program.id}>
                  <button
                    onClick={() => setActiveItem(activeItem === program.id ? null : program.id)}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#1b316e] hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-[#1b316e] transition-all group flex items-center justify-between"
                  >
                    {currentLang === "ar" ? program.name_ar : program.name_en}
                    <motion.span
                      animate={{ rotate: activeItem === program.id ? 180 : 0 }}
                      className="text-xs opacity-50 group-hover:opacity-100"
                    >
                      ▼
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {activeItem === program.id && program.ProgramTab && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-50"
                      >
                        {program.ProgramTab.map((tab) => (
                          <Link
                            key={tab.id}
                            href={`/${currentLang}/programs/${program.id}#${tab.slug}`}
                            className="block px-6 py-2 text-sm text-[#1b316e] hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 hover:text-[#1b316e] transition-all"
                          >
                            {currentLang === "ar" ? tab.title_ar : tab.title_en}
                          </Link>
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
