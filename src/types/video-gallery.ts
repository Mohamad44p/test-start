import { Video as PrismaVideo, VideoGallery as PrismaVideoGallery } from "@prisma/client";

export type VideoType = 'youtube' | 'local';

export interface Video extends Omit<PrismaVideo, 'type'> {
  type: VideoType;
  thumbnail?: string;
}

export type VideoGallery = PrismaVideoGallery & {
  videos: Video[];
};

export interface FormattedVideoGallery extends Omit<PrismaVideoGallery, 'createdAt'> {
  createdAt: string;
}

export interface VideoUpload {
  url: string;
  title_en: string;
  title_ar: string;
  description_en: string | null;
  description_ar: string | null;
  type: 'youtube' | 'local';
  thumbnail?: string;
  featured: boolean;
}

export interface VideoFormData {
  title_en: string;
  title_ar: string;
  date: string;
  videos: VideoUpload[];
}
