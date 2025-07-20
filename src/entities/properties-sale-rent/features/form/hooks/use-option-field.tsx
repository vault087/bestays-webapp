"use client";
import { useMemo, useId, useState, useCallback } from "react";
import { FormDropDownOption, FormDropDownProps } from "@/components/form/inputs/form-dropdown";
import { DBSerialID } from "@/entities/common/";
import { DBDictionaryEntry, useDictionaryFormStore } from "@/entities/dictionaries";
import { getAvailableLocalizedText } from "@/entities/localized-text";
import {
  DBPropertyCodeField,
  usePropertyFormStoreContext,
  PropertyFieldToDictionaryCodeMap,
  usePropertyFormStoreActions,
  usePropertyLocale,
  usePropertyFormStaticStore,
} from "@/entities/properties-sale-rent/";

export type OptionFieldState = FormDropDownProps & {
  inputId: string;
  title: string | undefined;
  subtitle: string | undefined;
  error?: string | undefined;
};

export const useOptionField = ({ field }: { field: DBPropertyCodeField }): OptionFieldState => {
  const inputId = useId();
  const locale = usePropertyLocale();

  const { property } = usePropertyFormStaticStore();
  const { updateProperty } = usePropertyFormStoreActions();

  const dictionaryCode = PropertyFieldToDictionaryCodeMap[field] || "";
  const dictionaryId = useDictionaryFormStore((state) => state.dictionaryByCode[dictionaryCode]);
  const dictionary = useDictionaryFormStore((state) => (dictionaryId ? state.dictionaries[dictionaryId] : undefined));
  const entries = useDictionaryFormStore((state) => (dictionaryId ? state.entries[dictionaryId] : undefined));

  const [currentValue, setCurrentValue] = useState<DBSerialID | null>(property[field] as DBSerialID);

  const entryToDropDownOption = useCallback(
    (entry: DBDictionaryEntry): FormDropDownOption => ({
      key: String(entry.id),
      label: getAvailableLocalizedText(entry.name, locale),
    }),
    [locale],
  );

  const initialEntry = currentValue ? entries?.[currentValue] : null;

  const setValue = useCallback(
    (value: DBSerialID) => {
      setCurrentValue(value);
      updateProperty((draft) => {
        draft[field] = value;
      });
    },
    [updateProperty, field],
  );

  const selectedOption = initialEntry ? entryToDropDownOption(initialEntry) : null;

  const options = useMemo(
    () => Object.values(entries || {}).map(entryToDropDownOption),
    [entries, entryToDropDownOption],
  );
  const selectOption = useCallback(
    (option: FormDropDownOption) => setValue(Number(option.key) as DBSerialID),
    [setValue],
  );

  const title = getAvailableLocalizedText(dictionary?.name, locale) || dictionary?.code;
  const subtitle = getAvailableLocalizedText(dictionary?.description, locale);

  return { inputId, selectedOption, options, selectOption, title, subtitle };
};
