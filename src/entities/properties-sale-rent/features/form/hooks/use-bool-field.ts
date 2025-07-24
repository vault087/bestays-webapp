"use client";
import { useCallback, useId, useState } from "react";
import {
  DBPropertyBoolField,
  usePropertyFormStaticStore,
  usePropertyFormStoreActions,
} from "@/entities/properties-sale-rent";

// Input hook for MutableProperty localized fields
export function usePropertyBoolInput(field: DBPropertyBoolField): {
  inputId: string;
  value: boolean;
  onChange: (value: boolean) => void;
  error?: string;
} {
  const { property } = usePropertyFormStaticStore();
  const { updateProperty } = usePropertyFormStoreActions();
  const initialValue = property[field] as boolean | null | undefined;
  const [value, setValue] = useState<boolean>(initialValue || false);
  const inputId = useId();

  const onChange = useCallback(
    (value: boolean) => {
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
    onChange,
    error,
  };
}
