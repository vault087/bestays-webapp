import { useCallback, useMemo } from "react";
import { useDictionaryStore } from "@/entities/dictionaries/stores/hooks/use-dictionary-store";
import { useProperty, usePropertyActions } from "@/entities/properties-sale-rent";
import { PropertyToDictionaryCodeMap } from "@/entities/properties-sale-rent/utils/property-field-to-code";

// Property field types that accept codes
type PropertyCodeField = keyof typeof PropertyToDictionaryCodeMap;

// Option type for select/multiselect components
type FieldOption = { code: string; label: string; isInactive?: boolean };

// Helper to find dictionary ID by code
function useDictionaryIdByCode(dictionaryCode: string): number | undefined {
  return useDictionaryStore((state) => {
    const dictionaries = Object.values(state.dictionaries);
    const dictionary = dictionaries.find((dict) => dict.code === dictionaryCode);
    return dictionary?.id;
  });
}

// Helper to get active entries for a dictionary with their display names
function useActiveEntriesWithNames(dictionaryId: number | undefined, locale: string): FieldOption[] {
  return useDictionaryStore((state) => {
    if (!dictionaryId || !state.entries[dictionaryId]) return [];

    const entries = Object.values(state.entries[dictionaryId]);
    return entries
      .filter((entry) => entry.is_active !== false) // Include entries without is_active field (default true)
      .map((entry) => ({
        code: entry.code || "",
        label: entry.name?.[locale] || entry.code || "",
        isInactive: entry.is_active === false, // For styling inactive entries
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  });
}

// Validation function for single code
function useValidateCode(dictionaryCode: string, code: string | undefined): string | undefined {
  const dictionaryId = useDictionaryIdByCode(dictionaryCode);

  return useDictionaryStore((state) => {
    if (!code) return undefined;

    if (!dictionaryId || !state.entries[dictionaryId]) {
      return `Dictionary "${dictionaryCode}" not found`;
    }

    const entries = Object.values(state.entries[dictionaryId]);
    const entryExists = entries.some((entry) => entry.code === code);

    if (!entryExists) {
      return `Code "${code}" does not exist in dictionary "${dictionaryCode}"`;
    }

    return undefined;
  });
}

// Validation function for arrays
function useValidateCodes(dictionaryCode: string, codes: string[]): string | undefined {
  const dictionaryId = useDictionaryIdByCode(dictionaryCode);

  return useDictionaryStore((state) => {
    if (codes.length === 0) return undefined;

    if (!dictionaryId || !state.entries[dictionaryId]) {
      return `Dictionary "${dictionaryCode}" not found`;
    }

    const entries = Object.values(state.entries[dictionaryId]);
    const availableCodes = entries.map((entry) => entry.code).filter(Boolean);

    const invalidCodes = codes.filter((code) => !availableCodes.includes(code));

    if (invalidCodes.length > 0) {
      return `Invalid codes: ${invalidCodes.join(", ")}`;
    }

    return undefined;
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
  const dictionaryId = useDictionaryIdByCode(dictionaryCode);
  const options = useActiveEntriesWithNames(dictionaryId, locale);

  const currentValue = property?.[field] as string | undefined;
  const error = useValidateCode(dictionaryCode, currentValue);

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
    dictionaryExists: !!dictionaryId,
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
  const dictionaryId = useDictionaryIdByCode(dictionaryCode);
  const options = useActiveEntriesWithNames(dictionaryId, locale);

  const currentValues = useMemo(() => (property?.[field] as string[] | undefined) || [], [property, field]);
  const error = useValidateCodes(dictionaryCode, currentValues);

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
    dictionaryExists: !!dictionaryId,
  };
}
