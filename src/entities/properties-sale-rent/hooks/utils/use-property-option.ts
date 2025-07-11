import { useCallback, useMemo } from "react";
import { useDictionaryEntries } from "@/entities/dictionaries/stores";
import { Code, Dictionary } from "@/entities/dictionaries/types/dictionary.types";
import { usePropertyActions, usePropertyField } from "@/entities/properties-sale-rent";
import { Property } from "@/entities/properties-sale-rent/types";
import { generateInputId } from "@/utils";

// Property field types that accept codes
export type PropertyOptionField = keyof Pick<Property, "area" | "ownership_type" | "property_type" | "divisible_sale">;

export type PropertyOption = {
  code: Code;
  label: string;
  isActive?: boolean;
};

export type PropertyOptionResponse = {
  inputId: string;
  selected: PropertyOption | undefined;
  setSelected: (code: Code) => void;
  options: PropertyOption[];
};

export function usePropertyOption(
  propertyId: string,
  locale: string,
  field: PropertyOptionField,
  dictionary: Dictionary,
  variant: string = "",
): PropertyOptionResponse {
  const entities = useDictionaryEntries(dictionary.id);
  const selectedCode = usePropertyField(propertyId, field) as Code | undefined;
  const { updateProperty } = usePropertyActions();

  const setSelected = useCallback(
    (code: Code) => {
      updateProperty(propertyId, (draft) => {
        draft[field] = code;
      });
    },
    [propertyId, field, updateProperty],
  );

  const inputId = useMemo(
    () => generateInputId("property", propertyId, field, variant, locale),
    [propertyId, field, variant, locale],
  );

  const options = useMemo(() => {
    return Object.values(entities)
      .filter((entry) => entry.is_active !== false)
      .map((entry) => ({
        code: entry?.code || "",
        label: entry?.name?.[locale] || entry.code || "",
        isActive: entry.is_active,
      }));
  }, [entities, locale]);

  const selectedOption = useMemo(() => {
    if (!selectedCode) {
      return undefined;
    }
    return options.find((option) => option.code === selectedCode);
  }, [selectedCode, options]);

  return {
    inputId,
    selected: selectedOption,
    setSelected,
    options: options,
  };
}
