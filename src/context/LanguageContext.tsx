'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { LanguageType } from '@/types/stats';

interface LanguageContextType {
  currentLang: LanguageType;
  setLanguage: (lang: LanguageType) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLang, setCurrentLang] = useState<LanguageType>('en');

  useEffect(() => {
    const pathLang = pathname.split('/')[1];
    const savedLang = localStorage.getItem('NEXT_LOCALE') || pathLang || 'en';
    setCurrentLang(savedLang);
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = savedLang;
  }, [pathname]);

  const switchLanguage = (lang: LanguageType) => {
    localStorage.setItem('NEXT_LOCALE', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    setCurrentLang(lang);
    
    const newPath = pathname.replace(/^\/[^/]+/, `/${lang}`);
    router.push(newPath);
  };

  return (
    <LanguageContext.Provider value={{ currentLang, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
