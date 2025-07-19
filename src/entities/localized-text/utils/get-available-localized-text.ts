import { LocalizedText, LocalizedTextSchema } from "@/entities/localized-text/types/localized-text.type";
import { DEFAULT_LOCALE } from "@/modules/i18n/types/locale-types";

/*
 Returns available value based on locale, default locale, first key, or undefined
 locale -> default locale -> first key -> undefined
*/
export function getAvailableLocalizedText(localizedText: LocalizedText | undefined | null, locale: string): string {
  if (!localizedText) return "";
  if (!LocalizedTextSchema.safeParse(localizedText).success) return "";

  if (localizedText[locale]) return localizedText[locale] || "";
  if (localizedText[DEFAULT_LOCALE]) return localizedText[DEFAULT_LOCALE] || "";

  const keys = Object.keys(localizedText);
  if (keys.length === 0) return "";

  const firstKey = keys[0];
  if (firstKey) return localizedText[firstKey] || "";

  return "";
}
