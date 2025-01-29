import { ContentGrid } from "@/components/News-blog/content-grid"
import { type ContentCardProps } from "@/components/News-blog/content-card"

const PUBLICATIONS: ContentCardProps[] = [
  {
    type: "publication",
    title: "User Stickiness: How to Create Products that Stick",
    date: "November 8, 2024",
    readTime: "8 min",
    tags: ["Product design", "Metrics", "SaaS"],
    imageUrl: "https://www.techstart.ps//public/files/server/publications/WhatsApp%20Image%202024-11-06%20at%2012.16.43%20PM%20(1).jpeg",
    slug: "user-stickiness",
  },
  {
    type: "publication",
    title: "The Ultimate Guide to User Onboarding",
    date: "October 24, 2024",
    readTime: "12 min",
    tags: ["Product design", "User onboarding", "SaaS"],
    imageUrl: "https://www.techstart.ps//public/files/image/orion%20112.PNG",
    slug: "user-onboarding",
  },
]

export default function Publications() {
  return <ContentGrid title="Publications" items={PUBLICATIONS} />
}

