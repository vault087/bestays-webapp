import { useCallback, useMemo } from "react";
import { useDictionaryStore } from "@/entities/dictionaries/stores/hooks/use-dictionary-store";
import { useProperty, usePropertyActions } from "@/entities/properties-sale-rent";
import { PropertyToDictionaryCodeMap } from "@/entities/properties-sale-rent/utils/property-field-to-code";

// Property field types that accept codes
type PropertyCodeField = keyof typeof PropertyToDictionaryCodeMap;

// Option type for select/multiselect components
type FieldOption = { code: string; label: string; isInactive?: boolean };

// Single consolidated hook to get all dictionary data for a field
function useDictionaryFieldData(
  dictionaryCode: string,
  locale: string,
): {
  dictionaryId: number | undefined;
  options: FieldOption[];
  dictionaryExists: boolean;
  availableCodes?: string[];
} {
  return useDictionaryStore((state) => {
    // Find dictionary by code
    const dictionaries = Object.values(state.dictionaries);
    const dictionary = dictionaries.find((dict) => dict.code === dictionaryCode);
    const dictionaryId = dictionary?.id;

    if (!dictionaryId || !state.entries[dictionaryId]) {
      return {
        dictionaryId: undefined,
        options: [],
        dictionaryExists: false,
      };
    }

    // Get entries and create options
    const entries = Object.values(state.entries[dictionaryId]);
    const options = entries
      .filter((entry) => entry.is_active !== false)
      .map((entry) => ({
        code: entry.code || "",
        label: entry.name?.[locale] || entry.code || "",
        isInactive: entry.is_active === false,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return {
      dictionaryId,
      options,
      dictionaryExists: true,
      availableCodes: entries.map((entry) => entry.code).filter((code): code is string => Boolean(code)),
    };
  });
}

// Generic hook for single code fields (like area)
export function usePropertySingleCodeField<T extends PropertyCodeField>(
  propertyId: string,
  field: T,
  locale: string = "en",
): {
  value: string | undefined;
  setValue: (code: string | undefined) => void;
  options: FieldOption[];
  error?: string;
  dictionaryExists: boolean;
} {
  const property = useProperty(propertyId);
  const { updateProperty } = usePropertyActions();

  const dictionaryCode = PropertyToDictionaryCodeMap[field];
  const { options, dictionaryExists, availableCodes } = useDictionaryFieldData(dictionaryCode, locale);

  const currentValue = property?.[field] as string | undefined;

  // Validation logic
  const error = useMemo(() => {
    if (!currentValue) return undefined;
    if (!dictionaryExists) return `Dictionary "${dictionaryCode}" not found`;
    if (!availableCodes?.includes(currentValue)) {
      return `Code "${currentValue}" does not exist in dictionary "${dictionaryCode}"`;
    }
    return undefined;
  }, [currentValue, dictionaryExists, dictionaryCode, availableCodes]);

  const setValue = useCallback(
    (code: string | undefined) => {
      updateProperty(propertyId, (draft) => {
        (draft[field] as string | undefined) = code;
      });
    },
    [propertyId, field, updateProperty],
  );

  return {
    value: currentValue,
    setValue,
    options,
    error,
    dictionaryExists,
  };
}

// Generic hook for array code fields (like highlights, land_features)
export function usePropertyArrayCodeField<T extends PropertyCodeField>(
  propertyId: string,
  field: T,
  locale: string = "en",
): {
  values: string[];
  setValues: (codes: string[]) => void;
  addValue: (code: string) => void;
  removeValue: (code: string) => void;
  toggleValue: (code: string) => void;
  options: FieldOption[];
  error?: string;
  dictionaryExists: boolean;
} {
  const property = useProperty(propertyId);
  const { updateProperty } = usePropertyActions();

  const dictionaryCode = PropertyToDictionaryCodeMap[field];
  const { options, dictionaryExists, availableCodes } = useDictionaryFieldData(dictionaryCode, locale);

  const currentValues = useMemo(() => (property?.[field] as string[] | undefined) || [], [property, field]);

  // Validation logic
  const error = useMemo(() => {
    if (currentValues.length === 0) return undefined;
    if (!dictionaryExists) return `Dictionary "${dictionaryCode}" not found`;
    const invalidCodes = currentValues.filter((code) => !availableCodes?.includes(code));
    if (invalidCodes.length > 0) {
      return `Invalid codes: ${invalidCodes.join(", ")}`;
    }
    return undefined;
  }, [currentValues, dictionaryExists, dictionaryCode, availableCodes]);

  const setValues = useCallback(
    (codes: string[]) => {
      updateProperty(propertyId, (draft) => {
        (draft[field] as string[]) = codes;
      });
    },
    [propertyId, field, updateProperty],
  );

  const addValue = useCallback(
    (code: string) => {
      if (!currentValues.includes(code)) {
        setValues([...currentValues, code]);
      }
    },
    [currentValues, setValues],
  );

  const removeValue = useCallback(
    (code: string) => {
      setValues(currentValues.filter((c) => c !== code));
    },
    [currentValues, setValues],
  );

  const toggleValue = useCallback(
    (code: string) => {
      if (currentValues.includes(code)) {
        removeValue(code);
      } else {
        addValue(code);
      }
    },
    [currentValues, addValue, removeValue],
  );

  return {
    values: currentValues,
    setValues,
    addValue,
    removeValue,
    toggleValue,
    options,
    error,
    dictionaryExists,
  };
}
