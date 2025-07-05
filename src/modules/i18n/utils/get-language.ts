import languages from "@cospired/i18n-iso-languages";
import enLocale from "@cospired/i18n-iso-languages/langs/en.json";
import ruLocale from "@cospired/i18n-iso-languages/langs/ru.json";
import thLocale from "@cospired/i18n-iso-languages/langs/th.json";

let isRegistered = false;

export function registerLanguages(): void {
  if (isRegistered) return;

  languages.registerLocale(enLocale);
  languages.registerLocale(ruLocale);
  languages.registerLocale(thLocale);

  isRegistered = true;
}

export const getLanguageName = (languageCode: string, locale: string): string | undefined => {
  // Ensure languages are registered before use
  registerLanguages();

  return languages.getName(languageCode, locale);
};
