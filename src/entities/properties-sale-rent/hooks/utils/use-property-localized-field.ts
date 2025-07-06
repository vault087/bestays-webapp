import { useCallback, useMemo } from "react";
import { LocalizedText } from "@/entities/localized-text";
import { useProperty, usePropertyActions } from "@/entities/properties-sale-rent";
import { generateInputId } from "@/utils/generate-input-id";

// Explicitly define the LocalizedText fields from Property type
type PropertyLocalizedTextFields = "title" | "description" | "land_and_construction";

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
  placeholder: string;
  error?: string;
} {
  const value = usePropertyLocalizedFieldDisplay(id, locale, field);

  const { updateProperty } = usePropertyActions();

  // Generate a unique input ID
  const inputId = useMemo(() => generateInputId("Property", id.toString(), field, locale), [id, locale, field]);

  // Handle change
  const onChange = useCallback(
    (value: string) => {
      updateProperty(id, (draft) => {
        const currentField = draft[field] as LocalizedText | null | undefined;
        if (!currentField) {
          (draft[field] as LocalizedText) = {};
        }
        (draft[field] as LocalizedText)[locale] = value;
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
    placeholder: `Enter Property ${field} (${locale})`,
    error,
  };
}
