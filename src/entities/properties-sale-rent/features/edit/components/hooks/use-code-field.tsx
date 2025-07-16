"use client";
import { useMemo, useState, useCallback } from "react";
import { DBCode } from "@/entities/dictionaries/types/dictionary.types";
import { getAvailableLocalizedText } from "@/entities/localized-text";
import {
  DBPropertyCodeField,
  useInitialPropertyContext,
  useDictionaryContext,
  covertPropertyFieldToDictionaryCode,
  usePropertyLocale,
} from "@/entities/properties-sale-rent/";
import { generateInputId } from "@/utils";

export type CodeOption = {
  code: DBCode;
  label: string;
};

export type CodeFieldState = {
  inputId: string;
  currentValue: CodeOption;
  options: CodeOption[];
  title: string | undefined;
  subtitle: string | undefined;
  setValue: (value: DBCode) => void;
};

export const useCodeField = ({
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
  const initialValue = initialProperty[field] as DBCode;

  // Local state for immediate UI updates
  const [currentValue, setCurrentValue] = useState<DBCode>(initialValue);

  const dictionaryCode = covertPropertyFieldToDictionaryCode[field];
  // Memoize computed values (options, titles) separately from current value
  const { inputId, options, title, subtitle } = useMemo(() => {
    const dictionary = dictionariesByCode[dictionaryCode];
    const entries = entriesByDictionaryCode[dictionaryCode];
    const inputId = generateInputId("property", initialProperty.id.slice(-8), field, variant, locale);

    const options: CodeOption[] = entries
      .filter((entry) => entry.code !== null)
      .map((entry) => ({
        code: entry.code as DBCode,
        label: getAvailableLocalizedText(entry.name, locale) || entry.code || "",
      }));

    const title = getAvailableLocalizedText(dictionary?.name, locale) || dictionary?.code || "";
    const subtitle = getAvailableLocalizedText(dictionary?.description, locale) || "";

    return { inputId, options, title, subtitle };
  }, [dictionariesByCode, entriesByDictionaryCode, dictionaryCode, field, variant, locale, initialProperty.id]);

  // Create current value option for display
  const currentValueOption = useMemo(() => {
    const entries = entriesByDictionaryCode[dictionaryCode];
    const dictionaryEntry = entries.find((entry) => entry.code === currentValue);
    const label = getAvailableLocalizedText(dictionaryEntry?.name, locale) || currentValue;
    return {
      code: currentValue,
      label,
    };
  }, [entriesByDictionaryCode, currentValue, locale, dictionaryCode]);

  // Update both local state and context
  const setValue = useCallback(
    (value: DBCode) => {
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
