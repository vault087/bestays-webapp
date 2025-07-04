"use client";

import { useTranslations, useLocale } from "next-intl";
import type { TranslationValues } from "next-intl";
import { useMemo } from "react";

// Define a type for the translation function for clarity
export type Translator = (key: string, values?: TranslationValues) => string;

export function useGenericTranslations(namespace?: string): {
  t: Translator;
  tCurrentLocale: Translator;
  tDefaultLocale: Translator;
  dateFormatter: (date: string) => string;
} {
  const currentLocale = useLocale();
  const defaultNamespace = namespace ? `default.${namespace}` : "default";
  const tForCurrentLocaleProvider = useTranslations(namespace);
  const tForDefaultLocaleProvider = useTranslations(defaultNamespace);

  return useMemo(() => {
    const tCurrentLocale = createSafeTranslator(tForCurrentLocaleProvider, {
      localeIdentifier: currentLocale,
      namespace: namespace || "",
    });

    const tDefaultLocale = createSafeTranslator(tForDefaultLocaleProvider, {
      localeIdentifier: "default",
      namespace: defaultNamespace,
    });

    const t: Translator = (key: string, values?: TranslationValues): string => {
      const currentLocaleTranslation = tCurrentLocale(key, values);
      const expectedFallback = namespace ? `${namespace}.${key}` : key;
      if (currentLocaleTranslation !== expectedFallback) {
        return currentLocaleTranslation;
      }
      return tDefaultLocale(key, values);
    };

    return {
      t,
      tCurrentLocale,
      tDefaultLocale,
      dateFormatter: (date: string) => {
        return new Intl.DateTimeFormat(currentLocale).format(new Date(date));
      },
    };
  }, [currentLocale, namespace, defaultNamespace, tForCurrentLocaleProvider, tForDefaultLocaleProvider]);
}

// Helper to create a safe translator with fallback and logging
const createSafeTranslator = (
  actualTranslator: ReturnType<typeof useTranslations>,
  logContext: { localeIdentifier: string; namespace: string },
): Translator => {
  return (key: string, values?: TranslationValues): string => {
    try {
      return actualTranslator(key, values);
    } catch (error) {
      console.warn(
        `[Generic Translation System Error] Locale: '${logContext.localeIdentifier}', Namespace: '${logContext.namespace}', Key: '${key}'. Falling back to key.`,
        values ? `Values: ${JSON.stringify(values)}` : "",
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
      return key;
    }
  };
};
