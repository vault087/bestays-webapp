"use client";
import { useCallback, useMemo, useState } from "react";
import { usePropertyFormStaticStore, usePropertyLocale, DBPropertyRoomsField } from "@/entities/properties-sale-rent";
import { generateInputId } from "@/utils/generate-input-id";

// Input hook for MutableProperty localized fields
export function usePropertyRoomsInput(
  field: DBPropertyRoomsField,
  variant?: string,
): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  onIncrement: () => void;
  onDecrement: () => void;
  error?: string;
} {
  const { initialProperty, updateProperty } = usePropertyFormStaticStore();
  const roomsFieldValue = initialProperty.rooms?.[field] as number | undefined;

  const [roomsValue, setRoomsValue] = useState<string>(roomsFieldValue?.toString() || "");
  const locale = usePropertyLocale();

  // Generate a unique input ID
  const inputId = useMemo(
    () => generateInputId("property-rooms", initialProperty.id.slice(-8), field, variant, locale),
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

  const onIncrement = useCallback(() => {
    onChange(String(Number(roomsValue) + 1));
  }, [onChange, roomsValue]);
  const onDecrement = useCallback(() => {
    onChange(String(Number(roomsValue) - 1));
  }, [onChange, roomsValue]);

  // Validate - field should not be empty for primary locale
  // This is a simplified version - a real implementation might have more validation
  const error = undefined;

  return {
    inputId,
    value: roomsValue,
    onChange,
    onIncrement,
    onDecrement,
    error,
  };
}
