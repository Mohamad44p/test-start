import { ContentGrid } from "@/components/News-blog/content-grid"
import { getPostsByType } from "@/app/actions/fetch-posts"
import { PostType } from "@/types/blog"

export const metadata = {
  title: 'Publications & Reports',
}

export default async function PublicationsPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;

  const {
    lang
  } = params;

  const { data: publications = [], error } = await getPostsByType(PostType.PUBLICATION)

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center text-gray-600">
          {lang === 'ar' 
            ? 'عذراً، حدث خطأ أثناء تحميل المنشورات'
            : 'Sorry, there was an error loading the publications'}
        </div>
      </div>
    )
  }

  const title = lang === 'ar' ? 'المنشورات والتقارير' : 'Publications & Reports'
  const subtitle = lang === 'ar'
    ? 'استكشف أحدث المنشورات والتقارير المتخصصة لدينا'
    : 'Explore our latest publications and specialized reports'

  return (
    <div className="py-12">
      <ContentGrid 
        title={title}
        subtitle={subtitle}
        items={publications}
      />
    </div>
  )
}

