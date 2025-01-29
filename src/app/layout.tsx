import './globals.css'
import { LanguageProvider } from '@/context/LanguageContext'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tech Start',
  description: 'Tech Start Platform',
}

export default function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <LanguageProvider defaultLang={params.lang}>
          <main>{children}</main>
        </LanguageProvider>
      </body>
    </html>
  )
}
