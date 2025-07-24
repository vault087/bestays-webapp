"use client";
import { useCallback, useId } from "react";
import {
  DBPropertyBoolField,
  usePropertyFormStaticStore,
  usePropertyFormStoreActions,
} from "@/entities/properties-sale-rent";
import { useCharacterLimit } from "@/modules/shadcn/hooks/use-character-limit";

// Input hook for MutableProperty localized fields
export function usePropertyBoolInput(
  field: DBPropertyBoolField,
  maxLength: number,
): {
  inputId: string;
  value: string;
  characterCount: number;
  onChange: (value: string) => void;
  error?: string;
} {
  const { property } = usePropertyFormStaticStore();
  const { updateProperty } = usePropertyFormStoreActions();
  const initialValue = property[field] as string | null | undefined;
  const { value, setValue, characterCount } = useCharacterLimit({ maxLength, initialValue: initialValue || "" });
  const inputId = useId();

  const onChange = useCallback(
    (value: string) => {
      setValue(value);
      updateProperty((draft) => {
        draft[field] = Boolean(value);
      });
    },
    [updateProperty, field, setValue],
  );

  const error = undefined;

  return {
    inputId,
    value,
    characterCount,
    onChange,
    error,
  };
}
