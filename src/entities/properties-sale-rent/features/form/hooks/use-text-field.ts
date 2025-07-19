"use client";
import { useCallback, useMemo } from "react";
import { DBPropertyTextField, usePropertyFormStaticStore, usePropertyFormStore } from "@/entities/properties-sale-rent";
import { usePropertyLocale } from "@/entities/properties-sale-rent/features/form/context/property-locale.context";
import { useCharacterLimit } from "@/modules/shadcn/hooks/use-character-limit";
import { generateInputId } from "@/utils/generate-input-id";

// Display hook for MutableProperty localized fields
export function usePropertyTextDisplay(field: DBPropertyTextField): string | undefined {
  return usePropertyFormStore((state) => state.property[field] as string | undefined);
}

// Input hook for MutableProperty localized fields
export function usePropertyTextInput(
  field: DBPropertyTextField,
  maxLength: number,
): {
  inputId: string;
  value: string;
  characterCount: number;
  onChange: (value: string) => void;
  error?: string;
} {
  const { property, updateProperty } = usePropertyFormStaticStore();
  const initialValue = property[field] as string | null | undefined;
  const locale = usePropertyLocale();

  const { value, setValue, characterCount } = useCharacterLimit({ maxLength, initialValue: initialValue || "" });

  // Generate a unique input ID
  const inputId = useMemo(
    () => generateInputId("property-text", property.id.slice(-8), field, locale),
    [property.id, locale, field],
  );

  // Handle change
  const onChange = useCallback(
    (value: string) => {
      setValue(value);
      updateProperty((draft) => {
        draft[field] = value;
      });
    },
    [updateProperty, field, setValue],
  );

  // Validate - field should not be empty for primary locale
  // This is a simplified version - a real implementation might have more validation
  const error = undefined;

  return {
    inputId,
    value,
    characterCount,
    onChange,
    error,
  };
}
