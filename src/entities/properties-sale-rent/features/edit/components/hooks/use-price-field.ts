"use client";
import { useCallback, useMemo } from "react";
import {
  DBPropertyPriceField,
  useInitialPropertyContext,
  usePropertyLocale,
  DBCurrency,
} from "@/entities/properties-sale-rent";
import { generateInputId } from "@/utils/generate-input-id";

// Input hook for Property localized fields
export function usePropertyPriceInput(field: DBPropertyPriceField): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  currency: DBCurrency;
  error?: string;
} {
  const { initialProperty, updateProperty } = useInitialPropertyContext();
  const locale = usePropertyLocale();

  // Generate a unique input ID
  const inputId = useMemo(
    () => generateInputId("property", initialProperty.id.slice(-8), field, locale),
    [initialProperty.id, locale, field],
  );

  const currentValue = initialProperty.price?.[field] as string | null | undefined;
  // Handle change
  const onChange = useCallback(
    (value: string) => {
      updateProperty((draft) => {
        if (!draft.price) {
          draft.price = {
            currency: "thb",
            [field]: value,
          };
        } else {
          draft.price[field] = Number(value);
        }
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
    currency: initialProperty.price?.currency || "thb",
    error,
  };
}
