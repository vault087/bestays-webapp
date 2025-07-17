"use client";
import { useCallback, useMemo, useState } from "react";
import { DBSerialID } from "@/entities/dictionaries/types/shared-db.types";
import { getAvailableLocalizedText } from "@/entities/localized-text";
import {
  useInitialPropertyContext,
  usePropertyLocale,
  DBPropertySizeField,
  useDictionaryContext,
  DBSizeEntry,
  DBSize,
  covertPropertyFieldToDictionaryCode,
} from "@/entities/properties-sale-rent";
import { generateInputId } from "@/utils/generate-input-id";

export type SizeUnitOption = {
  key: DBSerialID;
  label: string;
};

// Input hook for Property localized fields
export function usePropertySizeInput(
  field: DBPropertySizeField,
  variant?: string,
): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;

  unit: SizeUnitOption;
  setUnit: (value: DBSerialID) => void;
  options: SizeUnitOption[];

  error?: string;
} {
  const { entriesByDictionaryCode } = useDictionaryContext();
  const locale = usePropertyLocale();
  const { initialProperty, updateProperty } = useInitialPropertyContext();

  // Get initial value from context
  const initialSize = (initialProperty.size as DBSize)?.[field] as DBSizeEntry;

  const [sizeValue, setSizeValue] = useState<string>(initialSize?.value.toString() || "");
  const [sizeUnit, setSizeUnit] = useState<DBSerialID>(initialSize?.unit);

  const dictionaryCode = covertPropertyFieldToDictionaryCode["size.unit"];

  console.log("initialSize", initialProperty);
  // Memoize computed values (options, titles) separately from current value
  const { inputId, options } = useMemo(() => {
    const entries = entriesByDictionaryCode[dictionaryCode];
    const inputId = generateInputId("property", initialProperty.id.slice(-8), field, variant, locale);

    const options: SizeUnitOption[] = entries.map((entry) => ({
      key: entry.id,
      label: getAvailableLocalizedText(entry.name, locale) || "",
    }));

    return { inputId, options };
  }, [entriesByDictionaryCode, dictionaryCode, field, variant, locale, initialProperty.id]);

  // Create current value option for display
  const unit = useMemo(() => {
    const entries = entriesByDictionaryCode[dictionaryCode];
    const dictionaryEntry = entries.find((entry) => entry.id === sizeUnit);
    const label = getAvailableLocalizedText(dictionaryEntry?.name, locale) || "";
    return {
      key: sizeUnit,
      label,
    } as SizeUnitOption;
  }, [entriesByDictionaryCode, sizeUnit, dictionaryCode, locale]);

  // Update both local state and context
  const setUnit = useCallback(
    (value: DBSerialID) => {
      // Immediate UI update
      setSizeUnit(value);

      // Update context for persistence
      updateProperty((draft) => {
        if (draft.size && draft.size[field]) {
          draft.size[field].unit = value;
        }
      });
    },
    [updateProperty, field],
  );

  // Handle change
  const onValueChange = useCallback(
    (value: string) => {
      setSizeValue(value);
      updateProperty((draft) => {
        if (!draft.size) {
          // Setting currency only if price is not set
          draft.size = {};
        }
        draft.size[field] = {
          value: Number(value),
          unit: sizeUnit,
        };
      });
    },
    [updateProperty, field, sizeUnit],
  );

  return { inputId, value: sizeValue, onChange: onValueChange, unit, setUnit, options };
}
