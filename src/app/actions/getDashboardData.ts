"use server"

import db from "../db/db"
import { format } from "date-fns";

interface PostByMonth {
  month: Date;
  count: bigint;
}

interface MonthlyStats {
  month: Date;
  posts: bigint;
  images: bigint;
  videos: bigint;
  complaints: bigint;
}

type RecordValue = string | number | boolean | Date | null | undefined | bigint;
type Record = { [key: string]: RecordValue | Record | Array<Record | RecordValue> };

const convertBigIntsToNumbers = <T extends Record>(data: T): T => {
  if (typeof data === 'bigint') {
    return Number(data) as unknown as T;
  }
  if (Array.isArray(data)) {
    return data.map(item => convertBigIntsToNumbers(item as Record)) as unknown as T;
  }
  if (typeof data === 'object' && data !== null) {
    const converted: Record = {};
    for (const [key, value] of Object.entries(data)) {
      converted[key] = convertBigIntsToNumbers(value as Record);
    }
    return converted as T;
  }
  return data;
}

export async function getDashboardData() {
  const [
    postCount,
    tagCount,
    galleryCount,
    imageCount,
    videoGalleryCount,
    videoCount,
    programCount,
    beneficiaryCount,
    complaintCount,
    recentPosts,
    topPrograms,
    recentComplaints,
    teamMemberCount,
    faqCount,
    partnerCount,
    safeguardCount,
    postsByMonth,
    contactSubmissionCount,
    workWithUsCount,
    contactSubmissions,
    recentWorkWithUs,
    programCategories,
    programTabsCount,
    monthlyStats,
  ] = await Promise.all([
    db.post.count(),
    db.tag.count(),
    db.gallery.count(),
    db.image.count(),
    db.videoGallery.count(),
    db.video.count(),
    db.program.count(),
    db.beneficiary.count(),
    db.complaint.count(),
    db.post.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { 
        title_en: true, 
        createdAt: true,
        description_en: true 
      },
    }),
    db.program.findMany({
      take: 5,
      orderBy: { order: "asc" },
      select: { name_en: true, order: true },
    }),
    db.complaint.findMany({
      take: 5,
      orderBy: { submittedAt: "desc" },
      select: { complaintNumber: true, status: true, submittedAt: true },
    }),
    db.teamMember.count(),
    db.faqItem.count(),
    db.partnerPage.count(),
    db.safeguard.count(),
    db.$queryRaw<PostByMonth[]>`
      SELECT DATE_FORMAT(createdAt, '%Y-%m-01') as month, COUNT(*) as count
      FROM Post
      WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
      GROUP BY DATE_FORMAT(createdAt, '%Y-%m-01')
      ORDER BY month ASC
    `,
    db.contactSubmission.count(),
    db.workWithUs.count(),
    db.contactSubmission.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { name: true, subject: true, status: true, createdAt: true }
    }),
    db.workWithUs.findMany({
      take: 5,
      orderBy: { deadline: "asc" },
      where: { deadline: { gt: new Date() } },
      select: { titleEn: true, type: true, deadline: true }
    }),
    db.programCategory.findMany({
      include: { programs: true },
      orderBy: { order: "asc" }
    }),
    db.programTab.count(),
    db.$queryRaw<MonthlyStats[]>`
      SELECT 
        d.date as month,
        COUNT(DISTINCT p.id) as posts,
        COUNT(DISTINCT i.id) as images,
        COUNT(DISTINCT v.id) as videos,
        COUNT(DISTINCT c.id) as complaints
      FROM (
        SELECT DATE_FORMAT(
          DATE_SUB(NOW(), INTERVAL n MONTH),
          '%Y-%m-01'
        ) as date
        FROM (
          SELECT 0 as n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3
          UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7
          UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11
        ) months
      ) d
      LEFT JOIN Post p ON DATE_FORMAT(p.createdAt, '%Y-%m-01') = d.date
      LEFT JOIN Image i ON DATE_FORMAT(i.createdAt, '%Y-%m-01') = d.date
      LEFT JOIN Video v ON DATE_FORMAT(v.createdAt, '%Y-%m-01') = d.date
      LEFT JOIN Complaint c ON DATE_FORMAT(c.submittedAt, '%Y-%m-01') = d.date
      GROUP BY d.date
      ORDER BY d.date ASC
    `,
  ])

  // Format dates and transform data
  const result = {
    postCount,
    tagCount,
    galleryCount,
    imageCount,
    videoGalleryCount,
    videoCount,
    programCount,
    beneficiaryCount,
    complaintCount,
    recentPosts: recentPosts.map(post => ({
      ...post,
      createdAt: format(new Date(post.createdAt), 'MMM dd, yyyy')
    })),
    topPrograms,
    recentComplaints: recentComplaints.map(complaint => ({
      ...complaint,
      submittedAt: format(new Date(complaint.submittedAt), 'MMM dd, yyyy')
    })),
    teamMemberCount,
    faqCount,
    partnerCount,
    safeguardCount,
    postsByMonth: postsByMonth.map((item: PostByMonth) => ({
      month: format(new Date(item.month), 'MMM yyyy'),
      count: Number(item.count)
    })),
    contactSubmissionCount,
    workWithUsCount,
    contactSubmissions,
    recentWorkWithUs,
    programCategories: programCategories.map(category => ({
      name: category.name_en
    })),
    programTabsCount,
    monthlyStats: monthlyStats.map((stat: MonthlyStats) => ({
      month: format(new Date(stat.month), 'MMM yyyy'),
      posts: Number(stat.posts),
      images: Number(stat.images),
      videos: Number(stat.videos),
      complaints: Number(stat.complaints)
    }))
  }

  return convertBigIntsToNumbers(result)
}

export type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;

