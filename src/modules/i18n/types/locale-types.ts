import { US, RU, TH } from "country-flag-icons/react/3x2";
import React from "react";

export const LOCALES = ["en", "ru", "th"];
export const DEFAULT_LOCALE = "en";

// Flag components for easy access by hooks and components
export const FLAGS: Record<string, React.ComponentType<{ className?: string; title?: string }>> = {
  en: US,
  ru: RU,
  th: TH,
};

// Helper function to get flag component by locale
export const getFlagComponent = (locale: string): React.ComponentType<{ className?: string; title?: string }> => {
  return FLAGS[locale] || FLAGS[DEFAULT_LOCALE];
};

// Type for locale codes
export type LocaleType = (typeof LOCALES)[number];
