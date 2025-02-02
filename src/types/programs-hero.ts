export interface ProgramsHero {
  id: string;
  tagline: string;  // Keep legacy fields
  title: string;
  highlightWord: string;
  description: string;
  tagline_en: string;
  tagline_ar: string;
  title_en: string;
  title_ar: string;
  highlightWord_en: string;
  highlightWord_ar: string;
  description_en: string;
  description_ar: string;
  imageUrl: string | null;
  card1Title_en: string | null;
  card1Title_ar: string | null;
  card1Icon: string | null;
  card1Description_en: string | null;
  card1Description_ar: string | null;
  card1Show: boolean;
  card2Title_en: string | null;
  card2Title_ar: string | null;
  card2Icon: string | null;
  card2Description_en: string | null;
  card2Description_ar: string | null;
  card2Show: boolean;
  card3Title_en: string | null;
  card3Title_ar: string | null;
  card3Icon: string | null;
  card3Description_en: string | null;
  card3Description_ar: string | null;
  card3Show: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateProgramsHeroInput = Omit<ProgramsHero, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProgramsHeroInput = Partial<CreateProgramsHeroInput> & { id: string };