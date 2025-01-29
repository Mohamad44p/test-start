import React from 'react'
import { ContentGrid } from "@/components/News-blog/content-grid"
import { type ContentCardProps } from "@/components/News-blog/content-card"

const ANNOUNCEMENTS: ContentCardProps[] = [
  {
    type: "announcement",
    title: "PIONEER Announcement",
    date: "December 1, 2024",
    readTime: "3 min",
    tags: ["Announcement", "Update"],
    imageUrl: "https://www.techstart.ps/public/files/resized/350x200/image/E4web.jpg",
    slug: "pioneer-announcement"
  },
  {
    type: "announcement",
    title: "Announcement - HCIS",
    date: "December 1, 2024",
    readTime: "3 min",
    tags: ["Announcement", "Update"],
    imageUrl: "https://www.techstart.ps/public/files/resized/350x200/image/HCIS.png",
    slug: "hcis-announcement"
  }
]

export default function Announcements() {
  return <ContentGrid title="Announcements" items={ANNOUNCEMENTS} />
}
