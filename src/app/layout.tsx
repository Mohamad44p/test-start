import './globals.css'
import { LanguageProvider } from '@/context/LanguageContext'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tech Start',
  description: 'Tech Start Platform',
}



export default async function RootLayout(
  props: {
    children: React.ReactNode
    params: Promise<{ lang: string }>
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  return (
    <html lang="en" className="lenis lenis-smooth" suppressHydrationWarning>
      <body>
      <LanguageProvider defaultLang={params.lang}>
         {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
