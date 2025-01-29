import GrantTabs from "@/components/programs/grant-tabs";
import UpskillHero from "@/components/programs/upskill-hero";


export default function UpskillProgramPage() {
  return (
    <main className="min-h-screen flex flex-col">
        <UpskillHero />
        <GrantTabs />
      </main>
  );
}

