import deepmerge from "deepmerge";
import { hasLocale } from "next-intl";
import { getRequestConfig, RequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }): Promise<RequestConfig> => {
  const requested = await requestLocale;
  const currentLocale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const defaultLocale = routing.defaultLocale;

  const currentMessages = (await import(`/messages/${currentLocale}.json`)).default;

  // Skip merge for default locale (performance optimization)
  if (currentLocale === defaultLocale) {
    return {
      locale: currentLocale,
      messages: currentMessages,
    };
  }

  // Only merge for non-default locales
  let defaultMessages = {};
  try {
    defaultMessages = (await import(`/messages/${defaultLocale}.json`)).default;
  } catch (error) {
    console.warn(`[i18n] Could not load default locale messages for '${defaultLocale}'.`, error);
  }

  const messages = deepmerge(defaultMessages, currentMessages) as Record<string, unknown>;

  return {
    locale: currentLocale,
    messages,
  };
});
