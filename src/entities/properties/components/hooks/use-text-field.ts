import { useCallback, useMemo } from "react";
import { useInitialPropertyContext } from "@/entities/properties/components/context/initial-property.context";
import { useProperty } from "@/entities/properties-sale-rent";
import { PropertyTextField } from "@/entities/properties-sale-rent/types/property.type";
import { generateInputId } from "@/utils/generate-input-id";

// Display hook for Property localized fields
export function usePropertyTextDisplay(id: string, locale: string, field: PropertyTextField): string | undefined {
  const property = useProperty(id);
  if (!property) return undefined;

  const value = property[field] as string | null | undefined;
  return value === null ? undefined : value;
}

// Input hook for Property localized fields
export function usePropertyTextInput(
  locale: string,
  field: PropertyTextField,
): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
} {
  const { initialProperty, updateProperty } = useInitialPropertyContext();

  // Generate a unique input ID
  const inputId = useMemo(
    () => generateInputId("Property", initialProperty.id.slice(-8), field, locale),
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
    [locale, updateProperty, field],
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
