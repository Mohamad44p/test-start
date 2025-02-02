export interface ProgramTab {
    id: string;
    title_en: string;
    title_ar: string;
    slug: string;
    content_en: string;
    content_ar: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export type CreateProgramTabInput = Omit<ProgramTab, 'id' | 'createdAt' | 'updatedAt'>;
  export type UpdateProgramTabInput = Partial<CreateProgramTabInput> & { id: string };