import { useState } from 'react';

type Language = 'fr' | 'en';

export function useI18n() {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string, _params?: Record<string, any>, defaultValue?: string) => {
    return defaultValue || key;
  };

  return {
    t,
    language,
    locale: language,
    setLanguage
  };
}
