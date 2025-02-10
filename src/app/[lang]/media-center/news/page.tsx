import { ContentGrid } from "@/components/News-blog/content-grid"
import { FeaturedPosts } from "@/components/News-blog/FeaturedPosts"
import { getFeaturedPosts, getPostsByType } from "@/app/actions/fetch-posts"

export const dynamic = "force-dynamic"

export default async function NewsPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;

  const {
    lang
  } = params;

  const { data: featuredPosts = [] } = await getFeaturedPosts()
  const { data: allPosts = [] } = await getPostsByType('blog')

  const title = lang === 'ar' 
    ? "الأخبار والبيانات الصحفية"
    : "News & Press Releases"

  const subtitle = lang === 'ar'
    ? "ابق على اطلاع بآخر الأخبار والمنشورات والإعلانات لدينا"
    : "Stay updated with our latest news, publications, and announcements"

  return (
    <>
      <FeaturedPosts posts={featuredPosts} />
      <ContentGrid
        title={title}
        subtitle={subtitle}
        items={allPosts}
      />
    </>
  )
}
