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
  
  return (
    <main className="min-h-screen flex flex-col">
      {hero && <DynamicHero hero={hero} lang={params.lang} />}
      {program.ProgramTab && program.ProgramTab.length > 0 && (
        <DynamicTabs tabs={program.ProgramTab} lang={params.lang} />
      )}
    </main>
  );
}
