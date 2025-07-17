"use client";
import { useCallback, useMemo } from "react";
import { LocalizedText } from "@/entities/localized-text";
import {
  useProperty,
  useInitialPropertyContext,
  DBPropertyLocalizedTextField,
  usePropertyLocale,
} from "@/entities/properties-sale-rent/";
import { generateInputId } from "@/utils/generate-input-id";

// Display hook for Property localized fields
export function usePropertyLocalizedTextDisplay(id: string, field: DBPropertyLocalizedTextField): string | undefined {
  const property = useProperty(id);
  const locale = usePropertyLocale();

  if (!property) return undefined;

  const localizedField = property[field] as LocalizedText | null | undefined;
  const value = localizedField?.[locale];
  return value === null ? undefined : value;
}

// Input hook for Property localized fields
export function usePropertyLocalizedTextInput(
  field: DBPropertyLocalizedTextField,
  variant?: string,
): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
} {
  const { initialProperty, updateProperty } = useInitialPropertyContext();
  const locale = usePropertyLocale();
  // Generate a unique input ID
  const inputId = useMemo(
    () => generateInputId("property-localized-text", initialProperty.id.slice(-8), field, variant, locale),
    [initialProperty.id, locale, field, variant],
  );

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
