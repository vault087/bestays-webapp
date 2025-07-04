import languages from "@cospired/i18n-iso-languages";
import enLocale from "@cospired/i18n-iso-languages/langs/en.json";
import ruLocale from "@cospired/i18n-iso-languages/langs/ru.json";
import thLocale from "@cospired/i18n-iso-languages/langs/th.json";

export function registerLanguages(): void {
  languages.registerLocale(enLocale);
  languages.registerLocale(ruLocale);
  languages.registerLocale(thLocale);
}

export const getLanguageName = (languageCode: string, locale: string): string | undefined => {
  return languages.getName(languageCode, locale);
};
