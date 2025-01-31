import { ContentGrid } from "@/components/News-blog/content-grid"
import { getPostsByType } from "@/app/actions/fetch-posts"
import {toPostType } from "@/types/blog"

export default async function Publications(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;

  const {
    lang
  } = params;

  // Convert string to PostType using the utility function
  const { data: publications = [], error } = await getPostsByType(toPostType('publication'))

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
    <ContentGrid 
      title={title}
      subtitle={subtitle}
      items={publications}
    />
  )
}

