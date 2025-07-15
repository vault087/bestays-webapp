"use client";
import { useCallback, useMemo } from "react";
import {
  useProperty,
  DBPropertyTextField,
  useInitialPropertyContext,
  usePropertyLocale,
} from "@/entities/properties-sale-rent";
import { generateInputId } from "@/utils/generate-input-id";

// Display hook for Property localized fields
export function usePropertyTextDisplay(id: string, locale: string, field: DBPropertyTextField): string | undefined {
  const property = useProperty(id);
  if (!property) return undefined;

  const value = property[field] as string | null | undefined;
  return value === null ? undefined : value;
}

// Input hook for Property localized fields
export function usePropertyTextInput(field: DBPropertyTextField): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
} {
  const { initialProperty, updateProperty } = useInitialPropertyContext();
  const locale = usePropertyLocale();

  // Generate a unique input ID
  const inputId = useMemo(
    () => generateInputId("property", initialProperty.id.slice(-8), field, locale),
    [initialProperty.id, locale, field],
  );

  const currentValue = initialProperty[field] as string | null | undefined;
  // Handle change
  const onChange = useCallback(
    (value: string) => {
      updateProperty((draft) => {
        draft[field] = value;
      });
    },
    [updateProperty, field],
  );

  // Validate - field should not be empty for primary locale
  // This is a simplified version - a real implementation might have more validation
  const error = undefined;

  return {
    inputId,
    value: currentValue || "",
    onChange,
    error,
  };
}
