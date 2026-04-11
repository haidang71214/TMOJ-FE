"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "vi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Record<string, any>;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  translations: {},
});

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang === "en" || savedLang === "vi") {
      setLanguageState(savedLang);
    }
  }, []);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const module = await import(`../locales/${language}.json`);
        setTranslations(module.default);
      } catch (error) {
        console.error(`Failed to load translation for ${language}`, error);
      }
    };
    loadTranslations();
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}
