"use client";
import { useMemo, useId, useState, useCallback } from "react";
import { FormDropDownOption } from "@/components/form/inputs/form-dropdown";
import { DBSerialID } from "@/entities/common/";
import { DBDictionaryEntry, useDictionaryFormStore } from "@/entities/dictionaries";
import { getAvailableLocalizedText } from "@/entities/localized-text";
import {
  DBPropertyCodeField,
  usePropertyFormStaticStore,
  PropertyFieldToDictionaryCodeMap,
  usePropertyFormStoreActions,
  usePropertyLocale,
} from "@/entities/properties-sale-rent/";

export type OptionFieldState = {
  inputId: string;
  selectedOption: FormDropDownOption;
  dropdownOptions: FormDropDownOption[];
  onOptionChanged: (value: string) => void;
  title: string | undefined;
  subtitle: string | undefined;
};

export const useOptionField = ({
  field,
  variant = "",
}: {
  field: DBPropertyCodeField;
  variant?: string;
}): OptionFieldState => {
  const { property } = usePropertyFormStaticStore();
  const { updateProperty } = usePropertyFormStoreActions();
  const initialValue = property[field] as DBSerialID | null | undefined;
  const inputId = useId();
  const locale = usePropertyLocale();

  const dictionaryCode = PropertyFieldToDictionaryCodeMap[field] || "";
  const dictionaryId = useDictionaryFormStore((state) => state.dictionaryByCode[dictionaryCode]);
  const dictionary = useDictionaryFormStore((state) => (dictionaryId ? state.dictionaries[dictionaryId] : undefined));
  const entries = useDictionaryFormStore((state) => (dictionaryId ? state.entries[dictionaryId] : undefined));

  const entryToDropDownOption = useCallback(
    (entry?: DBDictionaryEntry | null): FormDropDownOption =>
      entry ? { key: String(entry.id), label: getAvailableLocalizedText(entry.name, locale) } : null,
    [locale],
  );

  const initialEntry = initialValue ? entries?.[initialValue] : null;

  const setValue = useCallback(
    (value: DBSerialID) => {
      setCurrentValue(value);
      updateProperty((draft) => {
        draft[field] = value;
      });
    },
    [updateProperty, field],
  );

  const dropdownValue = useMemo(() => entryToDropDownOption(initialEntry), [initialEntry, entryToDropDownOption]);
  const dropdownValues = useMemo(
    () => Object.values(entries || {}).map(entryToDropDownOption),
    [entries, entryToDropDownOption],
  );
  const dropdownOnChanged = useCallback((value: string) => setValue(Number(value) as DBSerialID), [setValue]);

  const title = getAvailableLocalizedText(dictionary?.name, locale) || dictionary?.code;
  const subtitle = getAvailableLocalizedText(dictionary?.description, locale);

  // Local state for immediate UI updates
  const [currentValue, setCurrentValue] = useState<DBSerialID | null>(initialValue || null);

  // Update both local state and context

  return { inputId, currentValue: dropdownValue, dropdownValues, title, subtitle, dropdownOnChanged };
};
