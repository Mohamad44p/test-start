"use server";

import { revalidatePath } from "next/cache";
import db from "@/app/db/db";
import { unlink } from "fs/promises";
import path from "path";
import { VideoGallery, VideoType } from "@/types/video-gallery";
import { CreateVideoGalleryInput, UpdateVideoGalleryInput } from "@/lib/schema/schema";

export async function getVideoGalleries(): Promise<VideoGallery[]> {
  const galleries = await db.videoGallery.findMany({
    include: {
      videos: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return galleries.map(gallery => ({
    ...gallery,
    videos: gallery.videos.map(video => ({
      ...video,
      thumbnail: video.thumbnail || null
    }))
  }));
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
  const gallery = await db.videoGallery.findUnique({
    where: { id },
    include: { videos: true },
  });

  if (!gallery) return null;

  return {
    ...gallery,
    videos: gallery.videos.map(video => ({
      ...video,
      thumbnail: video.thumbnail || null
    }))
  };
}

export async function updateVideoGallery(
  data: UpdateVideoGalleryInput
): Promise<{ success: boolean; gallery?: VideoGallery; error?: string }> {
  try {
    // Ensure exactly one video is featured
    const featuredVideos = data.videos.filter(v => v.featured);
    if (featuredVideos.length !== 1) {
      throw new Error('Exactly one video must be featured');
    }

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
            description_en: video.description_en || null,
            description_ar: video.description_ar || null,
            type: video.type,
            thumbnail: video.thumbnail || null, // Convert undefined to null
            featured: video.featured || false,
          })),
        },
      },
      include: {
        videos: true,
      },
    }) as VideoGallery; // Add type assertion

    revalidatePath("/admin/VideoGallery");
    return { success: true, gallery: updatedGallery };
  } catch (error) {
    console.error("Failed to update video gallery:", error);
    return { success: false, error: "Failed to update video gallery" };
  }
}

export async function createVideoGallery(
  data: CreateVideoGalleryInput,
): Promise<{ success: boolean; gallery?: VideoGallery; error?: string }> {
  try {
    // Ensure at least one video is featured
    if (!data.videos.length) {
      throw new Error("At least one video is required");
    }

    // If no video is featured, make the first one featured
    if (!data.videos.some(v => v.featured)) {
      data.videos[0].featured = true;
    }

    // If multiple videos are featured, keep only the first one featured
    let foundFeatured = false;
    data.videos = data.videos.map(video => ({
      ...video,
      featured: video.featured ? !foundFeatured && (foundFeatured = true) : false
    }));

    const processedVideos = data.videos.map(video => ({
      url: video.url,
      title_en: video.title_en,
      title_ar: video.title_ar,
      description_en: video.description_en || null,
      description_ar: video.description_ar || null,
      type: video.type as VideoType,
      thumbnail: video.thumbnail || null, // Convert undefined to null
      featured: video.featured,
    }));

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
    }) as VideoGallery; // Add type assertion

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

