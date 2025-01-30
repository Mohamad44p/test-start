"use server";

import db from "@/app/db/db";
import { revalidatePath } from "next/cache";

export type AboutUsData = {
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  imageUrl: string | null;
  card1Visible: boolean;
  card2Visible: boolean;
  card3Visible: boolean;
  cards: {
    titleEn: string;
    titleAr: string;
    descriptionEn: string;
    descriptionAr: string;
    icon: string;
  }[];
};

export async function getAboutUs() {
  return db.aboutUs.findFirst({
    include: {
      cards: true,
    },
  });
}

export async function getAboutUsById(id: string) {
  return db.aboutUs.findUnique({
    where: { id },
    include: {
      cards: true,
    },
  });
}

export async function createAboutUs(data: AboutUsData) {
  const { cards, ...aboutUsData } = data;

  const createdAboutUs = await db.aboutUs.create({
    data: {
      ...aboutUsData,
      cards: {
        create: cards,
      },
    },
  });

  revalidatePath("/admin/pages/about");
  return createdAboutUs;
}

export async function updateAboutUs(id: string, data: AboutUsData) {
  const { cards, ...aboutUsData } = data;

  const updatedAboutUs = await db.aboutUs.update({
    where: { id },
    data: {
      ...aboutUsData,
      cards: {
        deleteMany: {},
        create: cards,
      },
    },
  });

  revalidatePath("/admin/pages/about");
  return updatedAboutUs;
}

export async function deleteAboutUs(id: string) {
  await db.aboutUs.delete({
    where: { id },
  });

  revalidatePath("/admin/pages/about");
}
