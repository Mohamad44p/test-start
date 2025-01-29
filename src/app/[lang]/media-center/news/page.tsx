import { ContentGrid } from "@/components/News-blog/content-grid";
import { type ContentCardProps } from "@/components/News-blog/content-card";

const ALL_CONTENT: ContentCardProps[] = [
  {
    type: "blog",
    title: "Launch of Improving the IT Services Ecosystem (PIONEER) Program",
    description:
      "Learn about our new PIONEER program and its impact on the IT services ecosystem.",
    date: "November 8, 2024",
    readTime: "6 min",
    tags: ["Product design", "PLG"],
    imageUrl:
      "https://www.techstart.ps/public/files/resized/350x200/media/WhatsApp%20Image%202022-08-21%20at%201.39.13%20PM.jpeg",
    slug: "gamification-ux",
  },
  // Publications
  {
    type: "publication",
    title: "User Stickiness: How to Create Products that Stick",
    description:
      "A comprehensive guide to building sticky products that users love.",
    date: "November 8, 2024",
    readTime: "8 min",
    tags: ["Product design", "Metrics", "SaaS"],
    imageUrl:
      "https://www.techstart.ps//public/files/server/publications/WhatsApp%20Image%202024-11-06%20at%2012.16.43%20PM%20(1).jpeg",
    slug: "user-stickiness",
  },
  // Announcements
  {
    type: "announcement",
    title: "PIONEER Announcement",
    description: "Important updates about the PIONEER program launch.",
    date: "December 1, 2024",
    readTime: "3 min",
    tags: ["Announcement", "Update"],
    imageUrl:
      "https://www.techstart.ps/public/files/resized/350x200/image/E4web.jpg",
    slug: "pioneer-announcement",
  },
  {
    type: "blog",
    title: "Launch of Human Capital Improvement Stipends",
    date: "October 24, 2024",
    readTime: "12 min",
    tags: ["Product design", "User on", "SaaS"],
    imageUrl:
      "https://www.techstart.ps/public/files/resized/350x200/image/HCIS.png",
    slug: "user-onboarding",
  },
  {
    type: "blog",
    title:
      "The Palestinian government award financial grants to support the Palestinian technology ecosystem",
    date: "October 24, 2024",
    readTime: "12 min",
    tags: ["Product design", "User on", "SaaS"],
    imageUrl:
      "https://www.techstart.ps/public/files/resized/350x200/image/photo%205%20-T.jpg",
    slug: "government-tech-grants", // Changed from pioneer-announcement to unique slug
  },
  {
    type: "blog",
    title: "Gaza Tech and Innovative Recovery Program Launch",
    date: "October 24, 2024",
    readTime: "12 min",
    tags: ["Product design", "User on", "SaaS"],
    imageUrl:
      "https://www.techstart.ps/public/files/resized/350x200/image/iluustration.png",
    slug: "Gaza-Tech",
  },
];

export default function NewsPage() {
  return (
    <ContentGrid
      title="News & Press Releases"
      subtitle="Stay updated with our latest news, publications, and announcements"
      items={ALL_CONTENT}
    />
  );
}
