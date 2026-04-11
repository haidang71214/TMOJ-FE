"use client";

import { useContext } from "react";
import { LanguageContext, Language } from "@/Provider/LanguageProvider";

export const useTranslation = () => {
  const { language, setLanguage, translations } = useContext(LanguageContext);

  // Helper function to handle nested keys like a.b.c
  const t = (key: string, variables?: Record<string, string | number>): string => {
    if (!translations || Object.keys(translations).length === 0) {
      return ""; // Return empty string if translations aren't loaded yet so fallback kicks in
    }

    const keys = key.split(".");
    let value: any = translations;
    
    for (const k of keys) {
      if (value === undefined || value === null) break;
      value = value[k];
    }

    if (value === undefined) {
      return ""; // Fallback to empty string if not found so || operator works
    }

    let text = String(value);

    // Replace variables if provided
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        text = text.replace(`{{${k}}}`, String(v));
      });
    }

    return text;
  };

  return { t, language, setLanguage };
};
