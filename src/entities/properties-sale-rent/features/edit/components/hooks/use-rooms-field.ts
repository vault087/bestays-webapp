"use client";
import { useCallback, useMemo, useState } from "react";
import { useInitialPropertyContext, usePropertyLocale, DBPropertyRoomsField } from "@/entities/properties-sale-rent";
import { generateInputId } from "@/utils/generate-input-id";

// Input hook for Property localized fields
export function usePropertyRoomsInput(
  field: DBPropertyRoomsField,
  variant?: string,
): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
} {
  const { initialProperty, updateProperty } = useInitialPropertyContext();
  const roomsFieldValue = initialProperty.rooms?.[field] as number | undefined;

  const [roomsValue, setRoomsValue] = useState<string>(roomsFieldValue?.toString() || "");
  const locale = usePropertyLocale();

  // Generate a unique input ID
  const inputId = useMemo(
    () => generateInputId("property", initialProperty.id.slice(-8), field, variant, locale),
    [initialProperty.id, locale, field, variant],
  );

  // Handle change
  const onChange = useCallback(
    (value: string) => {
      setRoomsValue(value);
      updateProperty((draft) => {
        if (!draft.rooms) {
          draft.rooms = {};
        }
        draft.rooms[field] = Number(value);
      });
    },
    [updateProperty, field],
  );

  // Validate - field should not be empty for primary locale
  // This is a simplified version - a real implementation might have more validation
  const error = undefined;

  return {
    inputId,
    value: roomsValue,
    onChange,
    error,
  };
}
