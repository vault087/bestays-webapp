"use client";
import { useMemo, useState, useCallback } from "react";
import { Code } from "@/entities/dictionaries/types/dictionary.types";
import { useDictionaryContext } from "@/entities/properties/components/context/dictionary.context";
import { useInitialPropertyContext } from "@/entities/properties/components/context/initial-property.context";
import {
  covertPropertyFieldToDictionaryCode,
  PropertyMultiCodeField,
} from "@/entities/properties-sale-rent/types/property.type";
import { generateInputId } from "@/utils";

export type MultiCodeOption = {
  value: Code;
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
  locale,
  variant = "",
}: {
  field: PropertyMultiCodeField;
  locale: string;
  variant?: string;
}): MultiCodeFieldState => {
  const { dictionariesByCode, entriesByDictionaryCode } = useDictionaryContext();
  const { initialProperty, updateProperty } = useInitialPropertyContext();

  const fieldValue = initialProperty[field] as Code[];
  // Get initial values from context
  const initialValues: Code[] = fieldValue || [];

  // Local state for immediate UI updates
  const [currentValues, setCurrentValues] = useState<Code[]>(initialValues);

  // Memoize computed values (options, titles) separately from current values
  const { inputId, options, title, subtitle } = useMemo(() => {
    const dictionaryCode = covertPropertyFieldToDictionaryCode[field];
    const dictionary = dictionariesByCode[dictionaryCode];
    const entries = entriesByDictionaryCode[dictionaryCode];
    const inputId = generateInputId("property", initialProperty.id, field, variant, locale);

    const options: MultiCodeOption[] = entries.map((entry) => ({
      value: entry.code as Code,
      label: entry.name?.[locale] || entry.code || "",
      inputId: generateInputId("property-option", initialProperty.id, field + "-" + entry.code, variant, locale),
    }));

    const title = dictionary?.name?.[locale] || dictionary?.code || "";
    const subtitle = dictionary?.description?.[locale] || "";

    return { inputId, options, title, subtitle };
  }, [dictionariesByCode, entriesByDictionaryCode, field, variant, locale, initialProperty.id]);

  // Update both local state and context
  const toggleValue = useCallback(
    (value: Code | null | undefined, checked: boolean) => {
      if (!value) return;

      const newValues = checked ? [...currentValues, value] : currentValues.filter((v) => v !== value);

      // Immediate UI update
      setCurrentValues(newValues);

      // Update context for persistence
      updateProperty((draft) => {
        draft[field] = newValues;
      });
    },
    [currentValues, updateProperty, field],
  );

  const setValues = useCallback(
    (values: Code[]) => {
      // Immediate UI update
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
