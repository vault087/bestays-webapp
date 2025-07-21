"use client";
import { useCallback, useId, useState } from "react";
import {
  DBPropertyRoomsField,
  usePropertyFormStaticStore,
  usePropertyFormStoreActions,
} from "@/entities/properties-sale-rent";

// Input hook for MutableProperty localized fields
export function usePropertyRoomsInput(field: DBPropertyRoomsField): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  onIncrement: () => void;
  onDecrement: () => void;
  error?: string;
} {
  const inputId = useId();

  const { property } = usePropertyFormStaticStore();
  const { updateProperty } = usePropertyFormStoreActions();

  const [roomsValue, setRoomsValue] = useState<string>(property.rooms?.[field]?.toString() || "");

  // Handle change
  const onChange = useCallback(
    (value: string) => {
      setRoomsValue(value);
      updateProperty((draft) => {
        if (!draft.rooms) {
          draft.rooms = {};
        }
        draft.rooms[field] = parseInt(value) || 0;
      });
    },
    [updateProperty, field],
  );

  const onIncrement = useCallback(() => {
    const newValue = String((parseInt(roomsValue) || 0) + 1);
    onChange(newValue);
  }, [onChange, roomsValue]);

  const onDecrement = useCallback(() => {
    const newValue = String(Math.max((parseInt(roomsValue) || 0) - 1, 0));
    onChange(newValue);
  }, [onChange, roomsValue]);

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
