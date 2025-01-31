import { ContentGrid } from "@/components/News-blog/content-grid"
import { FeaturedPosts } from "@/components/News-blog/FeaturedPosts"
import { getFeaturedPosts, getPostsByType } from "@/app/actions/fetch-posts"

export default async function NewsPage() {
  const { data: featuredPosts = [] } = await getFeaturedPosts()
  const { data: allPosts = [] } = await getPostsByType('blog')

  return (
    <>
      <FeaturedPosts posts={featuredPosts} />
      <ContentGrid
        title="News & Press Releases"
        subtitle="Stay updated with our latest news, publications, and announcements"
        items={allPosts}
      />
    </>
  )
}
