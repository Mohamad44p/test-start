"use server";

import { revalidatePath } from "next/cache";
import db from "@/app/db/db";
import { unlink } from "fs/promises";
import path from "path";
import { VideoGallery } from "@/types/video-gallery";
import { CreateVideoGalleryInput, UpdateVideoGalleryInput } from "@/lib/schema/schema";

export async function getVideoGalleries(): Promise<VideoGallery[]> {
  return await db.videoGallery.findMany({
    include: {
      videos: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function deleteVideoGallery(id: string) {
  try {
    const result = await db.$transaction(async (tx) => {
      const gallery = await tx.videoGallery.findUnique({
        where: { id },
        include: { videos: true },
      });

      if (!gallery) {
        throw new Error('Gallery not found');
      }

      await tx.video.deleteMany({
        where: { galleryId: id },
      });

      await tx.videoGallery.delete({
        where: { id },
      });

      return gallery;
    });

    for (const video of result.videos) {
      if (!video.url) continue;
      const videoPath = path.join(process.cwd(), 'public', video.url.replace(/^\//, ''));
      try {
        await unlink(videoPath);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        console.log(`Could not delete file: ${videoPath}`);
      }
    }

    revalidatePath('/admin/VideoGallery');
    return { success: true };
  } catch (error) {
    console.error('Error in deleteVideoGallery:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete gallery' };
  }
}

export async function getVideoGallery(id: string): Promise<VideoGallery | null> {
  return await db.videoGallery.findUnique({
    where: { id },
    include: { videos: true },
  });
}

export async function updateVideoGallery(
  data: UpdateVideoGalleryInput
): Promise<{ success: boolean; gallery?: VideoGallery; error?: string }> {
  try {
    const updatedGallery = await db.videoGallery.update({
      where: { id: data.id },
      data: {
        title_en: data.title_en,
        title_ar: data.title_ar,
        createdAt: new Date(data.date),
        videos: {
          deleteMany: {},
          create: data.videos.map((video) => ({
            url: video.url,
            title_en: video.title_en,
            title_ar: video.title_ar,
            description_en: video.description_en || "",
            description_ar: video.description_ar || "",
          })),
        },
      },
      include: {
        videos: true,
      },
    });

    revalidatePath("/admin/VideoGallery");
    return { success: true, gallery: updatedGallery };
  } catch (error) {
    console.error("Failed to update video gallery:", error);
    return { success: false, error: "Failed to update video gallery" };
  }
}

function getYoutubeVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v');
    } else if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    }
  } catch {
    // If URL parsing fails, try regex
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([^&]+)/
    );
    return match ? match[1] : null;
  }
  return null;
}

export async function createVideoGallery(
  data: CreateVideoGalleryInput,
): Promise<{ success: boolean; gallery?: VideoGallery; error?: string }> {
  try {
    const processedVideos = data.videos.map(video => {
      if (video.type === 'youtube') {
        const videoId = getYoutubeVideoId(video.url);
        if (!videoId) {
          throw new Error('Invalid YouTube URL');
        }
        return {
          ...video,
          url: `https://www.youtube.com/embed/${videoId}`,
          thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          type: 'youtube' as const
        };
      }
      return {
        ...video,
        type: 'local' as const,
        thumbnail: null
      };
    });

    const newGallery = await db.videoGallery.create({
      data: {
        title_en: data.title_en,
        title_ar: data.title_ar,
        createdAt: new Date(data.date),
        videos: {
          create: processedVideos,
        },
      },
      include: {
        videos: true,
      },
    });

    revalidatePath("/admin/VideoGallery");
    return { success: true, gallery: newGallery };
  } catch (error) {
    console.error("Failed to create video gallery:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create video gallery" 
    };
  }
}

