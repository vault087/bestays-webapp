"use client";

import { useMemo, createContext, useContext } from "react";
import { useGenericTranslations, type Translator } from "@/modules/i18n/hooks/utils/use-generic-translations";

export const CMSTranslationContext = createContext<CMSTranslationContextType | null>(null);

export type CMSTranslationContextType = {
  t: Translator;
  tCurrentLocale: Translator;
  tDefaultLocale: Translator;
  formatCMSDate: (date: string) => string;
};

export function CMSTranslationContextProvider({
  namespace,
  children,
}: {
  namespace: string;
  children: React.ReactNode;
}) {
  const { t, tCurrentLocale, tDefaultLocale, dateFormatter } = useGenericTranslations("cms", namespace);

  const value = useMemo(
    () => ({ t, tCurrentLocale, tDefaultLocale, formatCMSDate: dateFormatter }),
    [t, tCurrentLocale, tDefaultLocale, dateFormatter],
  );

  return <CMSTranslationContext.Provider value={value}>{children}</CMSTranslationContext.Provider>;
}

export function useCMSTranslations(): CMSTranslationContextType {
  const context = useContext(CMSTranslationContext);
  if (!context) {
    throw new Error("useCMSTranslations must be used within a CMSTranslationContextProvider");
  }
  return context;
}

// Re-export Translator if it was intended to be available from this module
export type { Translator };
