import { useCallback, useMemo } from "react";
import { useDictionaryStore } from "@/entities/dictionaries/stores";
import { Code, Dictionary } from "@/entities/dictionaries/types/dictionary.types";
import { usePropertyActions, usePropertyField } from "@/entities/properties-sale-rent";
import { Property } from "@/entities/properties-sale-rent/types";
import { generateInputId } from "@/utils";
import { PropertyOption } from "./use-property-option";
// Property field types that accept codes

export type PropertyMultiOptionField = keyof Pick<
  Property,
  | "location_strengths"
  | "highlights"
  | "transaction_types"
  | "land_features"
  | "nearby_attractions"
  | "land_and_construction"
>;

export type PropertyMultiOptionResponse = {
  inputId: string;
  selected: PropertyOption[];
  setSelected: (codes: Code[]) => void;
  options: PropertyOption[];
};

export function usePropertyMultiOption(
  propertyId: string,
  locale: string,
  field: PropertyMultiOptionField,
  dictionary: Dictionary | undefined,
  variant: string = "",
): PropertyMultiOptionResponse {
  const entities = useDictionaryStore((state) => state.entries);
  const selectedCodes = usePropertyField(propertyId, field) as Code[] | undefined;
  const { updateProperty } = usePropertyActions();

  const setSelected = useCallback(
    (codes: Code[]) => {
      updateProperty(propertyId, (draft) => {
        draft[field] = codes;
      });
    },
    [propertyId, field, updateProperty],
  );

  const inputId = useMemo(
    () => generateInputId("property", propertyId, field, variant, locale),
    [propertyId, field, variant, locale],
  );

  const options = useMemo(() => {
    if (!dictionary || !dictionary.id) {
      return [];
    }

    return Object.values(entities[dictionary.id])
      .filter((entry) => entry.is_active !== false)
      .map((entry) => ({
        code: entry?.code || "",
        label: entry?.name?.[locale] || entry.code || "",
        isActive: entry.is_active,
      }));
  }, [entities, locale, dictionary]);

  const selectedOptions = useMemo(() => {
    if (!selectedCodes) {
      return [];
    }
    return options.filter((option) => selectedCodes.includes(option.code));
  }, [selectedCodes, options]);

  return {
    inputId,
    selected: selectedOptions,
    setSelected,
    options: options,
  };
}
