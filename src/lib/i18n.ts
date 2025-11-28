import { useState, useEffect } from "react";

export type Language = "fr" | "en" | "ki";

type Translations = {
  [key: string]: any;
};

const translations: Record<Language, Translations> = {
  fr: {},
  en: {},
  ki: {},
};

// État pour tracker si les traductions sont chargées
let translationsLoaded: Record<Language, boolean> = {
  fr: false,
  en: false,
  ki: false,
};

// Chargement dynamique des traductions
async function loadTranslations(lang: Language) {
  if (translationsLoaded[lang]) {
    return; // Déjà chargé
  }

  try {
    const module = await import(`../locales/${lang}/common.json`);
    translations[lang] = module.default;
    translationsLoaded[lang] = true;
    console.log(`✅ Traductions ${lang} chargées:`, translations[lang]);
  } catch (error) {
    console.error(`❌ Erreur chargement traductions ${lang}:`, error);
  }
}

// Récupération d'une valeur par chemin (ex: "app.title")
function getNestedValue(obj: any, path: string): string | undefined {
  return path.split(".").reduce((current, key) => current?.[key], obj);
}

export function useI18n() {
  const [language, setLanguage] = useState<Language>(() => {
    // Récupérer la langue depuis localStorage ou défaut 'fr'
    return (localStorage.getItem("kibosy_language") as Language) || "fr";
  });

  // État pour forcer le re-render après chargement
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger les traductions au changement de langue
  useEffect(() => {
    setIsLoaded(false); // Reset pendant le chargement

    loadTranslations(language).then(() => {
      setIsLoaded(true); // Force le re-render
    });
  }, [language]);

  // Pré-charger toutes les langues au démarrage
  useEffect(() => {
    // Charger les 3 langues en arrière-plan
    loadTranslations("fr");
    loadTranslations("en");
    loadTranslations("ki");
  }, []);

  const changeLanguage = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem("kibosy_language", newLang);
  };

  const t = (
    key: string,
    params?: Record<string, any>,
    defaultValue?: string
  ): string => {
    // Si pas encore chargé, retourner la clé ou valeur par défaut
    if (!isLoaded) {
      return defaultValue || key;
    }

    const translation = getNestedValue(translations[language], key);

    if (!translation) {
      console.warn(`⚠️ Traduction manquante: ${key} (${language})`);
      return defaultValue || key;
    }

    // Remplacement des paramètres si fournis
    if (params) {
      return Object.entries(params).reduce(
        (result, [param, value]) =>
          result.replace(`{{${param}}}`, String(value)),
        translation
      );
    }

    return translation;
  };

  return {
    t,
    language,
    locale: language,
    setLanguage: changeLanguage,
    isLoaded, // Exposer l'état de chargement si besoin
  };
}
