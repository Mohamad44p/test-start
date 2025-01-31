import { ContentGrid } from "@/components/News-blog/content-grid"
import { getPostsByType } from "@/app/actions/fetch-posts"
import { toPostType } from "@/types/blog"

export default async function AnnouncementsPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;

  const {
    lang
  } = params;

  const { data: announcements = [], error } = await getPostsByType(toPostType('announcement'))

  if (error) {
    return <div>Error loading announcements</div>
  }

  const title = lang === 'ar' ? 'الإعلانات' : 'Announcements'
  const subtitle = lang === 'ar' 
    ? 'اطلع على آخر الإعلانات والتحديثات المهمة'
    : 'Stay updated with our latest announcements and important updates'

  return (
    <ContentGrid 
      title={title}
      subtitle={subtitle}
      items={announcements}
    />
  )
}
