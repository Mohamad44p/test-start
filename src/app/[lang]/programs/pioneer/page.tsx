import PioneerTabs from "@/components/programs/pioneer-tabs";
import PioneerHero from "@/components/programs/pioneer-hero";

export default function PioneerProgramPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <PioneerHero />
      <PioneerTabs />
    </main>
  );
}
