"use client"

import { useLanguage } from "@/context/LanguageContext";

interface SafeGHeaderProps {
  initialLang: string;
}

export default function SafeGHeader({ initialLang }: SafeGHeaderProps) {
  const { currentLang = initialLang } = useLanguage();

  return (
    <div className="text-center space-y-3 mb-12 md:mb-16">
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
        {currentLang === "ar" ? "إرشادات السلامة لدينا" : "Our Safety Guidelines"}
      </h2>
      <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full" />
      <p className="mt-4 text-lg md:text-xl leading-8 text-gray-600 max-w-2xl mx-auto">
        {currentLang === "ar"
          ? "الالتزام بضمان بيئة آمنة ومأمونة للجميع."
          : "Commitment to ensuring a safe and secure environment for everyone."}
      </p>
    </div>
  );
}
