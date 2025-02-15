export interface ProgramTab {
  id: string
  title_en: string
  title_ar: string
  slug: string
  content_en: string
  content_ar: string
  processFile?: string | null
  createdAt: Date
  updatedAt: Date
  programPageId?: string | null
  programPage?: ProgramsPages | null
}

export interface ProgramsPages {
  id: string
  name_en: string
  name_ar: string
  categoryId: string | null
  category?: ProgramCategory | null
  ProgramTab?: ProgramTab[]
  createdAt: Date
  updatedAt: Date
}

export interface ProgramCategory {
  id: string;
  name_en: string;
  name_ar: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  programs?: ProgramWithTabs[]; // Make programs optional since it's not always included
}

export interface ProgramWithTabs {
  id: string;
  name_en: string;
  name_ar: string;
  categoryId: string | null;
  category?: ProgramCategory | null;
  ProgramTab?: {
    id: string;
    title_en: string;
    title_ar: string;
    slug: string;
  }[];
}

// Update ProgramsResponse interface
export interface ProgramsResponse {
  success: boolean;
  programs: Array<{
    id: string;
    name_en: string;
    name_ar: string;
    categoryId: string | null; // Allow null
    category: {
      id: string;
      name_en: string;
      name_ar: string;
    } | null; // Allow null
  }>;
  error?: string;
}

export type CreateProgramTabInput = Omit<ProgramTab, "id" | "createdAt" | "updatedAt" | "programPage">
export type UpdateProgramTabInput = Partial<CreateProgramTabInput> & { id: string }

export interface CreateProgramInput {
  name_en: string;
  name_ar: string;
  categoryId?: string;
}

export interface UpdateProgramInput extends CreateProgramInput {
  id: string;
}

export interface SimpleProgramType {
  id: string;
  name_en: string;
  name_ar: string;
}


