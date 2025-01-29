import { getFaqCategories } from '@/app/actions/pages/faqActions'
import { FAQSection } from "@/components/faq-section/faq-section"

// Enable ISR with 30-second revalidation
export const revalidate = 30

export default async function FAQsPage() {
  const categories = await getFaqCategories()

  // Transform Prisma data to match existing FAQ component structure
  const transformedCategories = categories.map(category => ({
    id: category.slug,
    label: category.nameEn,
    labelAr: category.nameAr,
  }))

  const faqsByCategory = categories.reduce((acc, category) => {
    acc[category.slug] = category.faqs.map(faq => ({
      question: faq.questionEn,
      questionAr: faq.questionAr,
      answer: faq.answerEn,
      answerAr: faq.answerAr,
    }))
    return acc
  }, {} as Record<string, Array<{ question: string; questionAr: string; answer: string; answerAr: string }>>)

  return (
    <div className="min-h-screen">
      <FAQSection categories={transformedCategories} faqsByCategory={faqsByCategory} />
    </div>
  )
}

