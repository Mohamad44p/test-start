import { notFound } from "next/navigation";
import db from "@/app/db/db";
import DynamicHero from "@/components/programs/dynamic-hero";
import DynamicTabs from "@/components/programs/dynamic-tabs";

export const dynamic = "force-dynamic"

async function getProgram(slug: string) {
  try {
    const program = await db.programsPages.findFirst({
      where: { id: slug },
      include: {
        ProgramsHero: true,
        ProgramTab: {
          orderBy: { createdAt: 'asc' }
        },
        faqCategories: {
          include: {
            faqs: {
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });
    return program;
  } catch (error) {
    console.error("Failed to fetch program:", error);
    return null;
  }
}

export default async function DynamicProgramPage({
  params
}: {
  params: { lang: string; slug: string }
}) {
  const program = await getProgram(params.slug);

  if (!program) {
    notFound();
  }

  const hero = program.ProgramsHero[0];
  
  // Add programPage to hero if it's missing
  const heroWithProgram = hero ? {
    ...hero,
    programPage: program
  } : null;

  // Prepare FAQ data
  const faqsByCategory = program.faqCategories.reduce((acc, category) => {
    acc[category.id] = category.faqs.map(faq => ({
      ...faq,
      category: category 
    }))
    return acc
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, {} as Record<string, any[]>)

  return (
    <main className="min-h-screen flex flex-col">
      {heroWithProgram && <DynamicHero hero={heroWithProgram} lang={params.lang} />}
      {program.ProgramTab && (
        <DynamicTabs 
          tabs={program.ProgramTab} 
          lang={params.lang} 
          faqCategories={program.faqCategories}
          faqsByCategory={faqsByCategory}
        />
      )}
    </main>
  );
}
