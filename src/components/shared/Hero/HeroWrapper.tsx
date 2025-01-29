import { getHeroSteps } from "@/app/actions/pages/hero"
import Hero from "./Hero"

export default async function HeroWrapper() {
  const response = await getHeroSteps()

  if (!response.success) {
    console.error("Failed to fetch hero steps:", response.error)
    return <div>Error loading hero content</div>
  }

  const steps = response.data.reduce(
    (acc, step) => {
      acc[step.order] = {
        title_en: step.title_en,
        title_ar: step.title_ar,
        tagline_en: step.tagline_en,
        tagline_ar: step.tagline_ar,
        description_en: step.description_en,
        description_ar: step.description_ar,
        color: step.color,
        imageUrl: step.imageUrl,
      }
      return acc
    },
    {} as Record<number, any>,
  )

  return <Hero steps={steps} />
}

