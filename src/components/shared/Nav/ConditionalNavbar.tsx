'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'
import { useLanguage } from '@/context/LanguageContext'

export function ConditionalNavbar() {
  const pathname = usePathname()
  const { currentLang } = useLanguage()

  if (pathname === `/${currentLang}`) {
    return null
  }

  return (
    <div className="mt-[6rem]">
      <Navbar />
    </div>
  )
}

