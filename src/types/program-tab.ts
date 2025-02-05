export interface ProgramTab {
  id: string
  title_en: string
  title_ar: string
  slug: string
  content_en: string
  content_ar: string
  createdAt: Date
  updatedAt: Date
  programPageId?: string | null
  programPage?: ProgramsPages | null
}

export interface ProgramsPages {
  id: string
  name_en: string
  name_ar: string
  createdAt: Date
  updatedAt: Date
}

export type CreateProgramTabInput = Omit<ProgramTab, "id" | "createdAt" | "updatedAt" | "programPage">
export type UpdateProgramTabInput = Partial<CreateProgramTabInput> & { id: string }

export type CreateProgramInput = Omit<ProgramsPages, "id" | "createdAt" | "updatedAt">
export type UpdateProgramInput = Partial<CreateProgramInput> & { id: string }

export interface SimpleProgramType {
  id: string;
  name_en: string;
  name_ar: string;
}


