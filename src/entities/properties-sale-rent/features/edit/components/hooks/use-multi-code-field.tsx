"use client";
import { useMemo, useState, useCallback, useRef } from "react";
import { Code } from "@/entities/dictionaries/types/dictionary.types";
import { getLocalizedTextValue } from "@/entities/localized-text";
import {
  DBPropertyMultiCodeField,
  useDictionaryContext,
  useInitialPropertyContext,
  covertPropertyFieldToDictionaryCode,
  usePropertyLocale,
} from "@/entities/properties-sale-rent/";
import { generateInputId } from "@/utils";

export type MultiCodeOption = {
  code: Code;
  label: string;
  inputId: string;
};

export type MultiCodeFieldState = {
  inputId: string;
  currentValues: Code[];
  options: MultiCodeOption[];
  title: string | undefined;
  subtitle: string | undefined;
  toggleValue: (value: Code | null | undefined, checked: boolean) => void;
  setValues: (values: Code[]) => void;
};

export const useMultiCodeField = ({
  field,
  variant = "",
}: {
  field: DBPropertyMultiCodeField;
  variant?: string;
}): MultiCodeFieldState => {
  const { dictionariesByCode, entriesByDictionaryCode } = useDictionaryContext();
  const { initialProperty, updateProperty } = useInitialPropertyContext();
  const locale = usePropertyLocale();

  // Get initial values from context
  const initialValues: Code[] = (initialProperty[field] as Code[]) || [];

  // Local state for immediate UI updates
  const [currentValues, setCurrentValues] = useState<Code[]>(initialValues);

  // Memoize computed values (options, titles) separately from current values
  const { inputId, options, title, subtitle } = useMemo(() => {
    const dictionaryCode = covertPropertyFieldToDictionaryCode[field];
    const dictionary = dictionariesByCode[dictionaryCode];
    const entries = entriesByDictionaryCode[dictionaryCode];
    const inputId = generateInputId("property", initialProperty.id.slice(-8), field, variant, locale);

    const options: MultiCodeOption[] = entries.map((entry) => ({
      code: entry.code as Code,
      label: getLocalizedTextValue(entry.name, locale) || entry.code || "",
      inputId: generateInputId("property-option", initialProperty.id, field + "-" + entry.code, variant, locale),
    }));

    const title = getLocalizedTextValue(dictionary?.name, locale) || dictionary?.code || "";
    const subtitle = getLocalizedTextValue(dictionary?.description, locale) || "";

    return { inputId, options, title, subtitle };
  }, [dictionariesByCode, entriesByDictionaryCode, field, variant, locale, initialProperty.id]);

  // Update both local state and context
  // ✅ OPTIMIZED - Stable callback with ref
  const currentValuesRef = useRef(currentValues);
  currentValuesRef.current = currentValues;

  const toggleValue = useCallback(
    (value: Code | null | undefined, checked: boolean) => {
      if (!value) return;

      const current = currentValuesRef.current; // ← Access via ref
      const newValues = checked ? [...current, value] : current.filter((v) => v !== value);

      setCurrentValues(newValues);
      updateProperty((draft) => {
        draft[field] = newValues;
      });
    },
    [updateProperty, field], // ← No currentValues dependency
  );

  const setValues = useCallback(
    (values: Code[]) => {
      // Immediate UI update
      console.log("setValues", values);
      setCurrentValues(values);

      // Update context for persistence
      updateProperty((draft) => {
        draft[field] = values;
      });
    },
    [updateProperty, field],
  );

  return { inputId, currentValues, options, title, subtitle, toggleValue, setValues };
};
