import { getSingleSafeguard } from "@/app/actions/safeguardActions"
import SafeguardsBanner from "./SafeguardsBanner"
import type { Safeguard } from "@/types/safeguard"

export default async function SafeguardsBannerWrapper() {
  const response = await getSingleSafeguard()

  if (!response.success || !response.data) {
    console.error("Failed to fetch safeguard:", response.error)
    return null
  }

  const safeguard: Safeguard = {
    id: response.data.id,
    domain: response.data.domain,
    title_en: response.data.title_en,
    title_ar: response.data.title_ar,
    tagline_en: response.data.tagline_en,
    tagline_ar: response.data.tagline_ar,
    description_en: response.data.description_en,
    description_ar: response.data.description_ar,
    longDescription_en: response.data.longDescription_en ?? '',
    longDescription_ar: response.data.longDescription_ar ?? '',
    bgColor: response.data.bgColor,
    attachmentUrl: response.data.attachmentUrl ?? '',
    imageUrl: response.data.imageUrl ?? '',
  }

  return <SafeguardsBanner safeguard={safeguard} />
}

