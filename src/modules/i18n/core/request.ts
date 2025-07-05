import { hasLocale } from "next-intl";
import { getRequestConfig, RequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }): Promise<RequestConfig> => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const currentLocale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const defaultLocale = routing.defaultLocale; // e.g., 'en'
  // Load current locale's base messages
  const currentMessages = (await import(`/messages/${currentLocale}.json`)).default;

  // Load default locale's messages if different from current
  let defaultMessages = {};
  if (currentLocale !== defaultLocale) {
    try {
      defaultMessages = (await import(`/messages/${defaultLocale}.json`)).default;
    } catch (error) {
      console.warn(`[i18n] Could not load default locale messages for '${defaultLocale}'.`, error);
    }
  } else {
    defaultMessages = currentMessages;
  }

  // Merge messages with default as fallback and keep default namespace for explicit access
  const messages = {
    ...defaultMessages,
    ...currentMessages,
    // Add default namespace for explicit access to default locale translations
    default: defaultMessages,
  };

  return {
    locale: currentLocale,
    messages,
  };
});
