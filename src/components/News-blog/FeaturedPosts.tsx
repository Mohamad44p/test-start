"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Calendar } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"
import type { BlogPost } from "@/types/blog"

interface FeaturedPostsProps {
  posts: BlogPost[]
}

export function FeaturedPosts({ posts }: FeaturedPostsProps) {
  const { currentLang } = useLanguage()

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-[#1b316e] to-[#862996] bg-clip-text text-transparent">
          {currentLang === 'ar' ? 'المنشورات المميزة' : 'Featured Posts'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <Link href={`/${currentLang}/media-center/news/${post.type}/${post.slug}`}>
                <div className="relative h-48 w-full">
                  <Image
                    src={post.imageUrl || '/placeholder.jpg'}
                    alt={currentLang === 'ar' ? post.title_ar : post.title_en}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-[#862996] rounded-full">
                      {post.type}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">
                    {currentLang === 'ar' ? post.title_ar : post.title_en}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {currentLang === 'ar' ? post.description_ar : post.description_en}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar size={16} className="mr-2" />
                    {formatDate(post.createdAt)}
                    {post.readTime && (
                      <span className="mx-2 text-gray-300">•</span>
                    )}
                    {post.readTime}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
