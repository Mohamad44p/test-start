'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'

export function ConditionalNavbar() {
  const pathname = usePathname()

  if (pathname === '/') {
    return null
  }

  return (
    <div className="mt-[6rem]">
      <Navbar />
    </div>
  )
}

