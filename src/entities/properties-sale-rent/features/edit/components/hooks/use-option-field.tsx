"use client";
import { useMemo, useState, useCallback } from "react";
import { DBSerialID } from "@/entities/dictionaries/types/";
import { getAvailableLocalizedText } from "@/entities/localized-text";
import {
  DBPropertyCodeField,
  useInitialPropertyContext,
  useDictionaryContext,
  covertPropertyFieldToDictionaryCode,
  usePropertyLocale,
} from "@/entities/properties-sale-rent/";
import { generateInputId } from "@/utils";

export type OptionFieldState = {
  key: DBSerialID;
  label: string;
};

export type CodeFieldState = {
  inputId: string;
  currentValue: OptionFieldState;
  options: OptionFieldState[];
  title: string | undefined;
  subtitle: string | undefined;
  setValue: (value: DBSerialID) => void;
};

export const useOptionField = ({
  field,
  variant = "",
}: {
  field: DBPropertyCodeField;
  variant?: string;
}): CodeFieldState => {
  const { dictionariesByCode, entriesByDictionaryCode } = useDictionaryContext();
  const locale = usePropertyLocale();
  const { initialProperty, updateProperty } = useInitialPropertyContext();

  // Get initial value from context
  const initialValue = initialProperty[field] as DBSerialID;

  // Local state for immediate UI updates
  const [currentValue, setCurrentValue] = useState<DBSerialID>(initialValue);

  const dictionaryCode = covertPropertyFieldToDictionaryCode[field];
  // Memoize computed values (options, titles) separately from current value
  const { inputId, options, title, subtitle } = useMemo(() => {
    const dictionary = dictionariesByCode[dictionaryCode];
    const entries = entriesByDictionaryCode[dictionaryCode];
    const inputId = generateInputId("property", initialProperty.id.slice(-8), field, variant, locale);

    const options: OptionFieldState[] = entries.map((entry) => ({
      key: entry.id,
      label: getAvailableLocalizedText(entry.name, locale) || "",
    }));

    const title = getAvailableLocalizedText(dictionary?.name, locale) || dictionary?.code || "";
    const subtitle = getAvailableLocalizedText(dictionary?.description, locale) || "";

    return { inputId, options, title, subtitle };
  }, [dictionariesByCode, entriesByDictionaryCode, dictionaryCode, field, variant, locale, initialProperty.id]);

  // Create current value option for display
  const currentValueOption = useMemo(() => {
    const entries = entriesByDictionaryCode[dictionaryCode];
    const dictionaryEntry = entries.find((entry) => entry.id === currentValue);
    const label = getAvailableLocalizedText(dictionaryEntry?.name, locale) || "";
    return {
      key: currentValue,
      label,
    } as OptionFieldState;
  }, [entriesByDictionaryCode, currentValue, locale, dictionaryCode]);

  // Update both local state and context
  const setValue = useCallback(
    (value: DBSerialID) => {
      // Immediate UI update
      setCurrentValue(value);

      // Update context for persistence
      updateProperty((draft) => {
        draft[field] = value;
      });
    },
    [updateProperty, field],
  );

  return { inputId, currentValue: currentValueOption, options, title, subtitle, setValue };
};
