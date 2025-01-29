"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { BentoGrid, BentoGridItem } from "../../ui/bento-grid"
import { Copy, File, Video, Camera } from "lucide-react"
import AnimatedNetworkBackground from "../Nav/AnimatedBackground"
import { useLanguage } from "@/context/LanguageContext"
import type { FeaturedImage } from "@/types/gallery"

interface MediaCenterProps {
  featuredImages: FeaturedImage[]
}

export function MediaCenter({ featuredImages = [] }: MediaCenterProps) {
  const { currentLang } = useLanguage()
  const bgColor = "#1b316e" // Updated primary color

  const gradientStyle = {
    backgroundImage: `
      radial-gradient(circle at 50% -100px, ${bgColor}10, transparent 400px),
      radial-gradient(circle at 100% 50%, ${bgColor}05, transparent 400px),
      radial-gradient(circle at 0% 100%, ${bgColor}05, transparent 400px)
    `,
  }

  const defaultImage = "/card-front.jpg"

  const items = [
    {
      title: currentLang === "ar" ? "آخر الأخبار والتحديثات" : "Latest News & Updates",
      description:
        currentLang === "ar"
          ? "استكشف إنجازاتنا وإعلاناتنا الأخيرة في قطاع التكنولوجيا."
          : "Explore our recent achievements and announcements in the tech sector.",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden">
          <Image
            src={featuredImages[0]?.url || defaultImage}
            alt={currentLang === "ar" 
              ? (featuredImages[0]?.title_ar || "صورة افتراضية") 
              : (featuredImages[0]?.title_en || "Default image")}
            width={600}
            height={300}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
      ),
      className: "md:col-span-2",
      icon: <Copy className="h-4 w-4 text-[#1b316e] group-hover:text-[#862996] transition-colors duration-300" />,
      link: "/news",
    },
    {
      title: currentLang === "ar" ? "البيانات الصحفية" : "Press Releases",
      description:
        currentLang === "ar"
          ? "الإعلانات الرسمية والتغطية الصحفية لمبادراتنا."
          : "Official announcements and press coverage of our initiatives.",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden">
          <Image
            src={featuredImages[1]?.url || defaultImage}
            alt={currentLang === "ar" 
              ? (featuredImages[1]?.title_ar || "صورة افتراضية") 
              : (featuredImages[1]?.title_en || "Default image")}
            width={300}
            height={300}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ),
      className: "md:col-span-1",
      icon: <File className="h-4 w-4 text-[#1b316e] group-hover:text-[#862996] transition-colors duration-300" />,
      link: "/press",
    },
    {
      title: currentLang === "ar" ? "معرض الصور" : "Photo Gallery",
      description:
        currentLang === "ar"
          ? "رحلة بصرية عبر أحداثنا ومعالمنا البارزة."
          : "Visual journey through our events and milestones.",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden">
          <Image
            src={featuredImages[2]?.url || defaultImage}
            alt={currentLang === "ar" 
              ? (featuredImages[2]?.title_ar || "صورة افتراضية") 
              : (featuredImages[2]?.title_en || "Default image")}
            width={300}
            height={300}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ),
      className: "md:col-span-1",
      icon: <Camera className="h-4 w-4 text-[#1b316e] group-hover:text-[#862996] transition-colors duration-300" />,
      link: "/gallery",
    },
    {
      title: currentLang === "ar" ? "قصص الفيديو" : "Video Stories",
      description:
        currentLang === "ar"
          ? "شاهد تأثيرنا من خلال محتوى فيديو مقنع."
          : "Watch our impact through compelling video content.",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden">
          <Image
            src={featuredImages[3]?.url || defaultImage}
            alt={currentLang === "ar" 
              ? (featuredImages[3]?.title_ar || "صورة افتراضية") 
              : (featuredImages[3]?.title_en || "Default image")}
            width={600}
            height={300}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ),
      className: "md:col-span-2",
      icon: <Video className="h-4 w-4 text-[#1b316e] group-hover:text-[#862996] transition-colors duration-300" />,
      link: "/videos",
    },
  ]

  return (
    <motion.section
      className="relative min-h-screen py-24 px-6 overflow-hidden"
      aria-labelledby="media-center-title"
      animate={{
        backgroundColor: `${bgColor}05`,
        transition: { duration: 0.5, ease: "easeInOut" },
      }}
      style={gradientStyle}
    >
      <AnimatedNetworkBackground color={bgColor} />

      <div className="relative text-center space-y-3 mb-16">
        <h2
          id="media-center-title"
          className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-[#1b316e] to-[#862996] bg-clip-text text-transparent animate-fade-up"
        >
          {currentLang === "ar" ? "المركز الإعلامي" : "Media Center"}
        </h2>
        <div className="w-32 h-1.5 bg-gradient-to-r from-[#1b316e] to-[#862996] mx-auto rounded-full animate-fade-up animation-delay-150" />
        <p className="mt-4 text-lg md:text-xl leading-8 text-[#1b316e] max-w-2xl mx-auto animate-fade-up animation-delay-200">
          {currentLang === "ar"
            ? "ابق على اطلاع بآخر أخبارنا وفعالياتنا وقصص النجاح من خلال معرض الوسائط لدينا"
            : "Stay updated with our latest news, events, and success stories through our media gallery"}
        </p>
      </div>

      <BentoGrid className="relative max-w-4xl mx-auto md:auto-rows-[20rem] gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            className={`${item.className} group hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm relative hover:-translate-y-1`}
            icon={item.icon}
          >
            <Link
              href={item.link}
              className="absolute inset-0 focus:ring-2 focus:ring-[#862996] focus:outline-none rounded-xl"
            >
              <span className="sr-only">{currentLang === "ar" ? `عرض ${item.title}` : `View ${item.title}`}</span>
            </Link>
            <div className="absolute inset-0 bg-gradient-to-br from-[#1b316e] to-[#862996] opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl" />
          </BentoGridItem>
        ))}
      </BentoGrid>
    </motion.section>
  )
}

