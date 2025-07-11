import { useCallback, useMemo } from "react";
import { LocalizedText } from "@/entities/localized-text";
import { useProperty, usePropertyActions } from "@/entities/properties-sale-rent";
import { generateInputId } from "@/utils/generate-input-id";

// Explicitly define the LocalizedText fields from Property type
type PropertyLocalizedTextFields = "title" | "description";

// Display hook for Property localized fields
export function usePropertyLocalizedFieldDisplay(
  id: string,
  locale: string,
  field: PropertyLocalizedTextFields,
): string | undefined {
  const property = useProperty(id);
  if (!property) return undefined;

  const localizedField = property[field] as LocalizedText | null | undefined;
  const value = localizedField?.[locale];
  return value === null ? undefined : value;
}

// Input hook for Property localized fields
export function usePropertyLocalizedFieldInput(
  id: string,
  locale: string,
  field: PropertyLocalizedTextFields,
): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
} {
  const value = usePropertyLocalizedFieldDisplay(id, locale, field);

  const { updateProperty } = usePropertyActions();

  // Generate a unique input ID
  const inputId = useMemo(() => generateInputId("Property", id.slice(-8), field, locale), [id, locale, field]);

  // Handle change
  const onChange = useCallback(
    (value: string) => {
      console.log("onChange", id, field, locale, value);
      updateProperty(id, (draft) => {
        const currentField = draft[field] as LocalizedText | null | undefined;
        console.log("currentField", currentField);
        if (!currentField) {
          (draft[field] as LocalizedText) = {};
        }
        (draft[field] as LocalizedText)[locale] = value;
        console.log("updateProperty", value);
      });
    },
    [id, locale, updateProperty, field],
  );

  // Validate - field should not be empty for primary locale
  // This is a simplified version - a real implementation might have more validation
  const error = undefined;

  return {
    inputId,
    value: value || "",
    onChange,
    error,
  };
}
