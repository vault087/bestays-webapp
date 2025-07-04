"use client";

import { useMemo } from "react";
import { useGenericTranslations, type Translator } from "./utils/use-generic-translations";

export function useTranslations(namespace?: string): {
  t: Translator; // Current Locale translations with a fallback to default locale
  tCurrentLocale: Translator; // Current Locale translations
  tDefaultLocale: Translator; // Default Locale translations
  dateFormatter: (date: string) => string;
} {
  const genericTranslations = useGenericTranslations(namespace);

  return useMemo(
    () => ({
      t: genericTranslations.t,
      tCurrentLocale: genericTranslations.tCurrentLocale,
      tDefaultLocale: genericTranslations.tDefaultLocale,
      dateFormatter: genericTranslations.dateFormatter,
    }),
    [genericTranslations],
  );
}

// Re-export Translator if it was intended to be available from this module
export type { Translator };
