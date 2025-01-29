import AboutUsContent from '@/components/who-we-are/about-us-content'
import { Suspense } from 'react'

export default function AboutUsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AboutUsContent />
    </Suspense>
  )
}

