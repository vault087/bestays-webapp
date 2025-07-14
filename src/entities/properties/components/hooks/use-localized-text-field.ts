import { useCallback, useMemo } from "react";
import { LocalizedText } from "@/entities/localized-text";
import { useInitialPropertyContext } from "@/entities/properties/components/context/initial-property.context";
import { useProperty } from "@/entities/properties-sale-rent";
import { PropertyLocalizedTextField } from "@/entities/properties-sale-rent/types/property.type";
import { generateInputId } from "@/utils/generate-input-id";

// Display hook for Property localized fields
export function usePropertyLocalizedTextDisplay(
  id: string,
  locale: string,
  field: PropertyLocalizedTextField,
): string | undefined {
  const property = useProperty(id);
  if (!property) return undefined;

  const localizedField = property[field] as LocalizedText | null | undefined;
  const value = localizedField?.[locale];
  return value === null ? undefined : value;
}

// Input hook for Property localized fields
export function usePropertyLocalizedTextInput(
  id: string,
  locale: string,
  field: PropertyLocalizedTextField,
): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
} {
  const { initialProperty, updateProperty } = useInitialPropertyContext();

  // Generate a unique input ID
  const inputId = useMemo(() => generateInputId("Property", id.slice(-8), field, locale), [id, locale, field]);

  const currentValue = initialProperty[field] as LocalizedText | null | undefined;
  // Handle change
  const onChange = useCallback(
    (value: string) => {
      updateProperty((draft) => {
        const currentField = draft[field] as LocalizedText | null | undefined;
        if (!currentField) {
          (draft[field] as LocalizedText) = {};
        }
        (draft[field] as LocalizedText)[locale] = value;
      });
    },
    [locale, updateProperty, field],
  );

  // Validate - field should not be empty for primary locale
  // This is a simplified version - a real implementation might have more validation
  const error = undefined;

  return {
    inputId,
    value: currentValue?.[locale] || "",
    onChange,
    error,
  };
}
