"use client";
import { useMemo, useId, useCallback } from "react";
import { FormOption, FormBaseOptionProps } from "@/components/form";
import { DBDictionary, DBDictionaryEntry, useDictionaryFormStore } from "@/entities/dictionaries";
import { getAvailableLocalizedText } from "@/entities/localized-text";
import {
  DBPropertyCodeField,
  DBPropertyMultiCodeField,
  PropertyFieldToDictionaryCodeMap,
  usePropertyLocale,
} from "@/entities/properties-sale-rent/";

export type OptionFieldState = FormBaseOptionProps & {
  inputId: string;
  title: string | undefined;
  description: string | undefined;
  error?: string | undefined;
  dictionary: DBDictionary | undefined;
  entries: Record<number, DBDictionaryEntry> | undefined;
  entryToDropDownOption: (entry: DBDictionaryEntry) => FormOption;
  locale: string;
};

export const useDictionaryOptions = ({
  field,
}: {
  field: DBPropertyCodeField | DBPropertyMultiCodeField;
}): OptionFieldState => {
  const inputId = useId();
  const locale = usePropertyLocale();

  const dictionaryCode = PropertyFieldToDictionaryCodeMap[field] || "";
  const dictionaryId = useDictionaryFormStore((state) => state.dictionaryByCode[dictionaryCode]);
  const dictionary = useDictionaryFormStore((state) => (dictionaryId ? state.dictionaries[dictionaryId] : undefined));
  const entries = useDictionaryFormStore((state) => (dictionaryId ? state.entries[dictionaryId] : undefined));

  const entryToDropDownOption = useCallback(
    (entry: DBDictionaryEntry): FormOption => ({
      key: String(entry.id),
      label: getAvailableLocalizedText(entry.name, locale),
    }),
    [locale],
  );

  const options = useMemo(
    () =>
      Object.values(entries || {})
        .map(entryToDropDownOption)
        .sort((a, b) => a.label.localeCompare(b.label)),
    [entries, entryToDropDownOption],
  );

  const title = getAvailableLocalizedText(dictionary?.name, locale) || dictionary?.code;
  const description = getAvailableLocalizedText(dictionary?.description, locale);

  return {
    inputId,
    options,
    isAddingOption: false,
    locale,
    description,
    dictionary,
    entries,
    entryToDropDownOption,
    title,
  };
};
