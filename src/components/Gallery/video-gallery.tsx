/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X, Calendar, Play } from "lucide-react"
import { GalleryFilters } from "./GalleryFilters"
import { useLanguage } from "@/context/LanguageContext"
import type { VideoGallery as VideoGalleryType, Video } from "@/types/video-gallery"
import { VideoControls } from "./VideoControls"
import { YouTubePlayer } from './YouTubePlayer';
import { getYoutubeVideoId } from "@/lib/utils";

interface VideoGalleryProps {
  galleries: VideoGalleryType[]
  lang: string
}

const VideoThumbnail = ({ video, onClick }: { video: Video; onClick: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [thumbnail, setThumbnail] = useState<string | null>(video.thumbnail || null)

  useEffect(() => {
    if (video.type === "youtube" && !thumbnail) {
      const videoId = video.url.split("/").pop()
      setThumbnail(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`)
    }
  }, [video, thumbnail])

  return (
    <div className="relative aspect-video cursor-pointer group" onClick={onClick}>
      {video.type === "youtube" ? (
        <img
          src={thumbnail || "/placeholder.jpg"}
          alt={video.title_en}
          className="w-full h-full object-cover rounded-lg"
          loading="lazy"
        />
      ) : (
        <video
          ref={videoRef}
          src={video.url}
          className="w-full h-full object-cover rounded-lg"
          preload="metadata"
          muted
          onLoadedData={() => {
            if (videoRef.current) {
              videoRef.current.currentTime = 1 // Set to 1 second to get a good thumbnail
            }
          }}
        />
      )}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
        <Play className="w-12 h-12 text-white" />
      </div>
    </div>
  )
}

const VideoPlayer = ({ video }: { video: Video }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  if (video.type === "youtube") {
    const videoId = getYoutubeVideoId(video.url);
    return <YouTubePlayer videoId={videoId} />;
  }

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <video
        ref={videoRef}
        src={video.url}
        className="w-full h-full rounded-lg"
        playsInline
        crossOrigin="anonymous"
        preload="metadata"
        muted // Start muted
      >
        <track kind="captions" />
        Your browser does not support the video tag.
      </video>
      <VideoControls 
        videoRef={videoRef} 
        onFullscreen={handleFullscreen}
      />
    </div>
  );
};

export const VideoGallery = ({ galleries: initialGalleries }: VideoGalleryProps) => {
  const { currentLang } = useLanguage()
  const [filteredGalleries, setFilteredGalleries] = useState(initialGalleries)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedGallery, setSelectedGallery] = useState<VideoGalleryType | null>(null)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(currentLang === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getLocalizedTitle = useCallback(
    (gallery: VideoGalleryType) => {
      return currentLang === "ar" ? gallery.title_ar : gallery.title_en
    },
    [currentLang],
  )

  const getLocalizedVideoTitle = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (video: any) => {
      return currentLang === "ar" ? video.title_ar : video.title_en
    },
    [currentLang],
  )

  useEffect(() => {
    const filtered = initialGalleries.filter((gallery) => {
      const searchLower = searchTerm.toLowerCase()
      return currentLang === "ar"
        ? gallery.title_ar.toLowerCase().includes(searchLower)
        : gallery.title_en.toLowerCase().includes(searchLower)
    })
    const sorted = [...filtered].sort((a, b) => {
      if (sortOrder === "asc") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })
    setFilteredGalleries(sorted)
  }, [searchTerm, sortOrder, initialGalleries, currentLang])

  const nextVideo = () => {
    if (selectedGallery) {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % selectedGallery.videos.length)
    }
  }

  const prevVideo = () => {
    if (selectedGallery) {
      setCurrentVideoIndex(
        (prevIndex) => (prevIndex - 1 + selectedGallery.videos.length) % selectedGallery.videos.length,
      )
    }
  }

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  const handleSort = useCallback((order: "asc" | "desc") => {
    setSortOrder(order)
  }, [])

  return (
    <div className={cn("min-h-screen bg-gray-100")}>
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <GalleryFilters
          onSearch={handleSearch}
          onSort={handleSort}
          title={currentLang === "ar" ? "معرض فيديو تك ستارت" : "TechStart Video Gallery"}
        />
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {filteredGalleries.map((gallery) => (
          <motion.section
            key={gallery.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-purple-800">{getLocalizedTitle(gallery)}</h2>
              <p className="text-gray-600 flex items-center mt-2">
                <Calendar size={18} className="mr-2" />
                {formatDate(new Date(gallery.createdAt))}
              </p>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {gallery.videos.map((video, index) => (
                <VideoThumbnail
                  key={video.id}
                  video={video}
                  onClick={() => {
                    setSelectedGallery(gallery)
                    setCurrentVideoIndex(index)
                  }}
                />
              ))}
            </div>
          </motion.section>
        ))}
      </main>

      <AnimatePresence>
        {selectedGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-[200]"
          >
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 z-[210] right-4 text-white"
                onClick={() => setSelectedGallery(null)}
              >
                <X size={24} />
              </Button>
              <div className="relative w-full max-w-4xl aspect-video">
                <VideoPlayer video={selectedGallery.videos[currentVideoIndex]} />
              </div>
              <div className="mt-4 text-white text-center">
                <h2 className="text-2xl font-bold mb-2">
                  {getLocalizedVideoTitle(selectedGallery.videos[currentVideoIndex])}
                </h2>
                <p className="text-lg mb-2">{getLocalizedTitle(selectedGallery)}</p>
                <p className="text-sm flex items-center justify-center">
                  <Calendar size={14} className="mr-1" />
                  {formatDate(new Date(selectedGallery.createdAt))}
                </p>
              </div>
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Button variant="ghost" size="icon" className="text-white" onClick={prevVideo}>
                  <ChevronLeft size={36} />
                </Button>
              </div>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Button variant="ghost" size="icon" className="text-white" onClick={nextVideo}>
                  <ChevronRight size={36} />
                </Button>
              </div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-2">
                  {selectedGallery.videos.map((_, index) => (
                    <button
                      key={index}
                      aria-label={`Go to video ${index + 1}`}
                      className={`w-2 h-2 rounded-full ${index === currentVideoIndex ? "bg-white" : "bg-gray-500"}`}
                      onClick={() => setCurrentVideoIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}