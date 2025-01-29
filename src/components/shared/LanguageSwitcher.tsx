'use client';

import { useLanguage } from '@/context/LanguageContext';
import { languages } from '@/config/languages';

export default function LanguageSwitcher() {
  const { currentLang, switchLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      {Object.entries(languages).map(([code, lang]) => (
        <button
          key={code}
          onClick={() => switchLanguage(code)}
          className={`px-3 py-1 rounded ${
            currentLang === code
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
}
