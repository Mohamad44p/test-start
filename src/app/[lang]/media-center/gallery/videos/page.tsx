import { VideoGallery } from "@/components/Gallery/video-gallery";
import { getVideoGalleries } from "@/app/actions/videoAction";

interface VideoGalleryPageProps {
  params: {
    lang: string
  }
}

export default async function VideoGalleryPage({ params: { lang } }: VideoGalleryPageProps) {
  const galleries = await getVideoGalleries();
  return <VideoGallery galleries={galleries} lang={lang} />;
}

