"use client";
import { useMemo, useState, useCallback } from "react";
import { useStore } from "zustand";
import { DBSerialID } from "@/entities/common/";
import { useDictionarySlice } from "@/entities/dictionaries/features/edit/context/dictionary.store.context";
import { getAvailableLocalizedText } from "@/entities/localized-text";
import {
  DBPropertyCodeField,
  useInitialPropertyContext,
  covertPropertyFieldToDictionaryCode,
  usePropertyLocale,
} from "@/entities/properties-sale-rent/";
import { generateInputId } from "@/utils";

export type SingleOption = {
  key: DBSerialID;
  label: string;
};

export type OptionFieldState = {
  inputId: string;
  currentValue: SingleOption;
  options: SingleOption[];
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
}): OptionFieldState => {
  const store = useDictionarySlice();

  const dictionaryCode = covertPropertyFieldToDictionaryCode[field];
  const dictionaryId = useStore(store, (state) => state.dictionariesByCode[dictionaryCode]) || 0;
  const dictionary = useStore(store, (state) => state.dictionaries[dictionaryId]);
  const entriesRecord = useStore(store, (state) => state.entries[dictionaryId]);

  const locale = usePropertyLocale();
  const { initialProperty, updateProperty } = useInitialPropertyContext();

  const propertyId = initialProperty.id;
  // Get initial value from context
  const initialValue = initialProperty[field] as DBSerialID;

  // Local state for immediate UI updates
  const [currentValue, setCurrentValue] = useState<DBSerialID>(initialValue);

  // Memoize computed values (options, titles) separately from current value
  const { inputId, options, title, subtitle } = useMemo(() => {
    const entries = Object.values(entriesRecord) || [];
    const inputId = generateInputId("property-option", propertyId.slice(-8), field, variant, locale);

    const options: SingleOption[] = Object.values(entries).map((entry) => ({
      key: entry.id,
      label: getAvailableLocalizedText(entry.name, locale) || "",
    }));

    const title = getAvailableLocalizedText(dictionary?.name, locale) || dictionary?.code || "";
    const subtitle = getAvailableLocalizedText(dictionary?.description, locale) || "";

    return { inputId, options, title, subtitle };
  }, [dictionary, entriesRecord, field, variant, locale, propertyId]);

  // Create current value option for display
  const currentValueOption = useMemo(() => {
    const entries = Object.values(entriesRecord) || [];
    const dictionaryEntry = entries.find((entry) => entry.id === currentValue);
    const label = getAvailableLocalizedText(dictionaryEntry?.name, locale) || "";
    return {
      key: currentValue,
      label,
    } as SingleOption;
  }, [entriesRecord, currentValue, locale]);

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
