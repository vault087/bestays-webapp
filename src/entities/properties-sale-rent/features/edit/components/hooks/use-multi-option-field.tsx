"use client";
import { useMemo, useState, useCallback } from "react";
import { useStore } from "zustand";
import { DBSerialID } from "@/entities/common/";
import { useDictionaryStoreContext } from "@/entities/dictionaries/features/edit/context/dictionary.store.context";
import { getAvailableLocalizedText } from "@/entities/localized-text";
import {
  DBPropertyMultiCodeField,
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

export type MultiOptionFieldState = {
  inputId: string;
  dictionaryId: DBSerialID | undefined;
  currentValues: DBSerialID[];
  options: MultiOption[];
  title: string | undefined;
  subtitle: string | undefined;
  toggleValue: (value: DBSerialID | null | undefined, checked: boolean) => void;
  setValues: (values: DBSerialID[]) => void;
};

const EMPTY_OBJECT = {};
export const useMultiOptionField = ({
  field,
  variant = "",
}: {
  field: DBPropertyMultiCodeField;
  variant?: string;
}): MultiOptionFieldState => {
  const store = useDictionaryStoreSlice();

  const dictionaryCode = covertPropertyFieldToDictionaryCode[field];
  const dictionaryId = useStore(store, (state) => state.dictionariesByCode[dictionaryCode]) || 0;
  const dictionary = useStore(store, (state) => state.dictionaries[dictionaryId]);
  const entriesRecord = useStore(store, (state) => state.entries?.[dictionaryId] || EMPTY_OBJECT);

  console.log("entriesRecord", dictionary, store.getState());
  const { initialProperty, updateProperty } = useInitialPropertyContext();
  const propertyId = initialProperty.id;
  const locale = usePropertyLocale();

  // Get initial values from context
  const initialValues: DBSerialID[] = (initialProperty[field] as DBSerialID[]) || [];

  // Local state for immediate UI updates
  const [currentValues, setCurrentValues] = useState<DBSerialID[]>(initialValues);

  // Memoize computed values (options, titles) separately from current values
  const { inputId, options, title, subtitle } = useMemo(() => {
    const entries = Object.values(entriesRecord) || [];
    const inputId = generateInputId("property-multi-option", propertyId.slice(-8), field, variant, locale);

    const options: MultiOption[] = entries.map((entry) => ({
      key: entry.id,
      label: getAvailableLocalizedText(entry.name, locale) || "",
      inputId: generateInputId("multi-option", propertyId, field + "-" + entry.id, variant, locale),
    }));

    const title = getAvailableLocalizedText(dictionary?.name, locale) || dictionary?.code || "";
    const subtitle = getAvailableLocalizedText(dictionary?.description, locale) || "";

    return { inputId, dictionaryId: dictionary?.id, options, title, subtitle };
  }, [dictionary, entriesRecord, field, variant, locale, propertyId]);

  const toggleValue = useCallback(
    (value: DBSerialID | null | undefined, checked: boolean) => {
      if (!value) return;

      const current = currentValues; // ← Access via ref
      const newValues = checked ? [...current, value] : current.filter((v) => v !== value);

      setCurrentValues(newValues);
      updateProperty((draft) => {
        draft[field] = newValues;
      });
    },
    [updateProperty, field, currentValues], // ← No currentValues dependency
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
