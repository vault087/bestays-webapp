"use client";
import { useMemo, useState, useCallback, useRef } from "react";
import { DBSerialID } from "@/entities/common/";
import { getAvailableLocalizedText } from "@/entities/localized-text";
import {
  DBPropertyMultiCodeField,
  useDictionaryContext,
  useInitialPropertyContext,
  covertPropertyFieldToDictionaryCode,
  usePropertyLocale,
} from "@/entities/properties-sale-rent/";
import { generateInputId } from "@/utils";

export type MultiOption = {
  key: DBSerialID;
  label: string;
  inputId: string;
};

export type MultiCodeFieldState = {
  inputId: string;
  dictionaryId: DBSerialID | undefined;
  currentValues: DBSerialID[];
  options: MultiOption[];
  title: string | undefined;
  subtitle: string | undefined;
  toggleValue: (value: DBSerialID | null | undefined, checked: boolean) => void;
  setValues: (values: DBSerialID[]) => void;
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
  const initialValues: DBSerialID[] = (initialProperty[field] as DBSerialID[]) || [];

  // Local state for immediate UI updates
  const [currentValues, setCurrentValues] = useState<DBSerialID[]>(initialValues);

  // Memoize computed values (options, titles) separately from current values
  const { inputId, dictionaryId, options, title, subtitle } = useMemo(() => {
    const dictionaryCode = covertPropertyFieldToDictionaryCode[field];
    const dictionary = dictionariesByCode[dictionaryCode];
    const entries = entriesByDictionaryCode[dictionaryCode];
    const inputId = generateInputId("property-multi-option", initialProperty.id.slice(-8), field, variant, locale);

    const options: MultiOption[] = entries.map((entry) => ({
      key: entry.id,
      label: getAvailableLocalizedText(entry.name, locale) || "",
      inputId: generateInputId("multi-option", initialProperty.id, field + "-" + entry.id, variant, locale),
    }));

    const title = getAvailableLocalizedText(dictionary?.name, locale) || dictionary?.code || "";
    const subtitle = getAvailableLocalizedText(dictionary?.description, locale) || "";

    return { inputId, dictionaryId: dictionary?.id, options, title, subtitle };
  }, [dictionariesByCode, entriesByDictionaryCode, field, variant, locale, initialProperty.id]);

  // Update both local state and context
  // ✅ OPTIMIZED - Stable callback with ref
  const currentValuesRef = useRef(currentValues);
  currentValuesRef.current = currentValues;

  const toggleValue = useCallback(
    (value: DBSerialID | null | undefined, checked: boolean) => {
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
    (values: DBSerialID[]) => {
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

  return { inputId, dictionaryId, currentValues, options, title, subtitle, toggleValue, setValues };
};
