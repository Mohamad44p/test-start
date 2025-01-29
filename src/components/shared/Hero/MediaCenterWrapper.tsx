import { getFeaturedImages } from "@/app/actions/create-gallery"
import { MediaCenter } from "./MediaCenter"

export default async function MediaCenterWrapper() {
  const featuredImagesResponse = await getFeaturedImages(4)

  if (!featuredImagesResponse.success) {
    console.error("Failed to fetch featured images:", featuredImagesResponse.error)
    return <MediaCenter featuredImages={[]} />
  }

  const featuredImages = featuredImagesResponse.data || []
  
  console.log("MediaCenterWrapper - Featured Images Count:", featuredImages.length)
  console.log("MediaCenterWrapper - Featured Images:", JSON.stringify(featuredImages, null, 2))

  return <MediaCenter featuredImages={featuredImages} />
}
