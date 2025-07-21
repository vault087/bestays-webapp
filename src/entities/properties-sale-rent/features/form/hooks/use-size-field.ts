"use client";
import { useCallback, useId, useMemo, useState } from "react";
import { DBSerialID } from "@/entities/common/";
import { useDictionaryFormStore } from "@/entities/dictionaries";
import { getAvailableLocalizedText } from "@/entities/localized-text";
import {
  usePropertyFormStaticStore,
  usePropertyFormStoreActions,
  DBPropertySizeField,
  DBSizeEntry,
  DBSize,
  usePropertyLocale,
} from "@/entities/properties-sale-rent";

export type SizeUnitOption = {
  key: DBSerialID;
  label: string;
};

// Input hook for MutableProperty localized fields
export function usePropertySizeInput(field: DBPropertySizeField): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  unit: SizeUnitOption;
  setUnit: (value: DBSerialID) => void;
  options: SizeUnitOption[];
  error?: string;
} {
  const inputId = useId();
  const locale = usePropertyLocale();

  const { property } = usePropertyFormStaticStore();
  const { updateProperty } = usePropertyFormStoreActions();

  const dictionaryId = useDictionaryFormStore((state) => state.dictionaryByCode["measurement_units"]);
  const entries = useDictionaryFormStore((state) => (dictionaryId ? state.entries[dictionaryId] : {}));

  // Get initial value from property
  const initialSize = (property.size as DBSize)?.[field] as DBSizeEntry;

  const [sizeValue, setSizeValue] = useState<string>(initialSize?.value?.toString() || "");
  const [sizeUnit, setSizeUnit] = useState<DBSerialID>(initialSize?.unit);

  // Create options from dictionary entries
  const options: SizeUnitOption[] = useMemo(
    () =>
      Object.values(entries || {}).map((entry) => ({
        key: entry.id,
        label: getAvailableLocalizedText(entry.name, locale),
      })),
    [entries, locale],
  );

  // Create current unit option for display
  const unit: SizeUnitOption = useMemo(() => {
    const entry = entries?.[sizeUnit];
    return {
      key: sizeUnit,
      label: entry ? getAvailableLocalizedText(entry.name, locale) : "",
    };
  }, [entries, sizeUnit, locale]);

  // Handle value change
  const onChange = useCallback(
    (value: string) => {
      setSizeValue(value);
      updateProperty((draft) => {
        if (!draft.size) {
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

  // Handle unit change
  const setUnit = useCallback(
    (value: DBSerialID) => {
      setSizeUnit(value);
      updateProperty((draft) => {
        if (!draft.size) {
          draft.size = {};
        }
        if (!draft.size[field]) {
          draft.size[field] = {
            value: Number(sizeValue) || 0,
            unit: value,
          };
        } else {
          draft.size[field].unit = value;
        }
      });
    },
    [updateProperty, field, sizeValue],
  );

  const error = undefined;

  return {
    inputId,
    value: sizeValue,
    onChange,
    unit,
    setUnit,
    options,
    error,
  };
}
