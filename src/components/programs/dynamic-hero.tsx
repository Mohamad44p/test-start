"use client";

import ReusableHero from "./reusable-hero";
import type { ProgramsHero } from "@/types/programs-hero"; // Make sure to import from your types file
import { AVAILABLE_ICONS, type IconName } from '@/config/icons';
import type { LucideIcon } from 'lucide-react';

interface DynamicHeroProps {
  hero: ProgramsHero;
  lang: string;
}

export default function DynamicHero({ hero, lang }: DynamicHeroProps) {
  const getIconComponent = (iconName: string | null): React.ReactNode => {
    if (!iconName) return null;
    const Icon: LucideIcon | undefined = AVAILABLE_ICONS[iconName as IconName];
    if (!Icon) {
      console.error(`Icon not found: ${iconName}`);
      return null;
    }
    return (
      <Icon className="size-6 text-blue-600" />
    );
  };

  const features = [
    hero.card1Show && hero.card1Title_en && hero.card1Title_ar && hero.card1Description_en && hero.card1Description_ar ? {
      icon: getIconComponent(hero.card1Icon),
      title: lang === 'ar' ? hero.card1Title_ar : hero.card1Title_en,
      description: lang === 'ar' ? hero.card1Description_ar : hero.card1Description_en,
    } : null,
    hero.card2Show && hero.card2Title_en && hero.card2Title_ar && hero.card2Description_en && hero.card2Description_ar ? {
      icon: getIconComponent(hero.card2Icon),
      title: lang === 'ar' ? hero.card2Title_ar : hero.card2Title_en,
      description: lang === 'ar' ? hero.card2Description_ar : hero.card2Description_en,
    } : null,
    hero.card3Show && hero.card3Title_en && hero.card3Title_ar && hero.card3Description_en && hero.card3Description_ar ? {
      icon: getIconComponent(hero.card3Icon),
      title: lang === 'ar' ? hero.card3Title_ar : hero.card3Title_en,
      description: lang === 'ar' ? hero.card3Description_ar : hero.card3Description_en,
    } : null,
  ].filter((feature): feature is { icon: React.ReactNode; title: string; description: string; } => 
    feature !== null
  );

  return (
    <>
      <ReusableHero
        badge={lang === 'ar' ? hero.tagline_ar : hero.tagline_en}
        title={lang === 'ar' ? hero.title_ar : hero.title_en}
        highlightedWord={lang === 'ar' ? hero.highlightWord_ar : hero.highlightWord_en}
        description={lang === 'ar' ? hero.description_ar : hero.description_en}
        primaryButtonText={lang === 'ar' ? "تقدم الآن" : "Apply Now"}
        secondaryButtonText={lang === 'ar' ? "معايير الأهلية" : "Eligibility Criteria"}
        imageSrc={hero.imageUrl || '/default-hero.png'}
        imageAlt={hero.name}
        features={features.length > 0 ? features : undefined}
        secondaryButtonProps={{
          href: `${hero.programPageId}/eligibility`,
          text: lang === 'ar' ? "معايير الأهلية" : "Eligibility Criteria"
        }}
      />

      {(hero.objectives_en || hero.objectives_ar) && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
                {lang === 'ar' ? "أهداف البرنامج" : "Program Objectives"}
              </h2>
              <div className="prose prose-lg mx-auto">
                <div dangerouslySetInnerHTML={{ 
                  __html: lang === 'ar' ? (hero.objectives_ar || '') : (hero.objectives_en || '') 
                }} />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
