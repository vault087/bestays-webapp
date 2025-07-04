import type { TranslationValues } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";

// Define a type for the translation function for clarity
type Translator = (key: string, values?: TranslationValues) => Promise<string>;

export type GenericServerTranslationsResult = {
  t: Translator;
  tCurrentLocale: Translator;
  tDefaultLocale: Translator;
  dateFormatter: (date: string | Date, options?: Intl.DateTimeFormatOptions) => string;
};

// This function provides a structured way to get translation functions on the server.
export async function getGenericServerTranslations({
  namespace,
}: {
  namespace?: string;
}): Promise<GenericServerTranslationsResult> {
  const locale = await getLocale();

  const defaultNamespace = namespace ? `default.${namespace}` : "default";

  // Helper to create a translator for a specific namespace
  const createTranslator = (targetNamespace?: string): Translator => {
    return async (key: string, values?: TranslationValues): Promise<string> => {
      try {
        const tInstance = await getTranslations(targetNamespace);
        if (!tInstance.has(key)) {
          return key;
        }
        return tInstance(key, values);
      } catch (error) {
        console.warn(
          `[Generic Server Translation Error] Namespace: '${targetNamespace}', Key: '${key}'. Falling back to key.`,
          values ? `Values: ${JSON.stringify(values)}` : "",
          `Error: ${error instanceof Error ? error.message : String(error)}`,
        );
        return key;
      }
    };
  };

  const tCurrentLocale = createTranslator(namespace);
  const tDefaultLocale = createTranslator(defaultNamespace);

  const t: Translator = async (key: string, values?: TranslationValues): Promise<string> => {
    const currentLocaleTranslation = await tCurrentLocale(key, values);

    const tInstance = await getTranslations(namespace);
    if (tInstance.has(key)) {
      const tInstanceRaw = tInstance.raw(key);
      const expectedFallback = namespace ? `${namespace}.${key}` : key;

      if (tInstanceRaw !== expectedFallback) {
        return currentLocaleTranslation;
      }
    }

    console.warn(
      `[Generic Server Translation Error] Namespace: '${namespace}', Key: '${key}'. Falling back to default.`,
      values ? `Values: ${JSON.stringify(values)}` : "",
    );

    return tDefaultLocale(key, values);
  };

  return {
    t,
    tCurrentLocale,
    tDefaultLocale,
    dateFormatter: (date: string | Date, options?: Intl.DateTimeFormatOptions) => {
      return new Intl.DateTimeFormat(locale, options).format(new Date(date));
    },
  };
}
