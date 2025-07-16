"use client";
import { useCallback, useMemo, useState } from "react";
import {
  DBPropertyPriceField,
  useInitialPropertyContext,
  usePropertyLocale,
  DBCurrency,
  DEFAULT_CURRENCY,
  CurrencySchema,
} from "@/entities/properties-sale-rent";
import { generateInputId } from "@/utils/generate-input-id";

// Input hook for Property localized fields
export function usePropertyPriceInput(field: DBPropertyPriceField): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  currency: DBCurrency;
  currencies: DBCurrency[];
  setCurrency: (currency: DBCurrency) => void;
  error?: string;
} {
  const { initialProperty, updateProperty } = useInitialPropertyContext();
  const [currentCurrency, setCurrentCurrency] = useState<DBCurrency>(
    initialProperty.price?.currency || DEFAULT_CURRENCY,
  );
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
          // Setting currency only if price is not set
          draft.price = {
            currency: currentCurrency,
          };
        }
        draft.price[field] = Number(value);
      });
    },
    [updateProperty, field, currentCurrency],
  );

  const setCurrency = useCallback(
    (currency: DBCurrency) => {
      setCurrentCurrency(currency);
      updateProperty((draft) => {
        // Changing currency only if price is already set
        if (draft.price) {
          draft.price.currency = currency;
        }
      });
    },
    [updateProperty],
  );

  // Validate - field should not be empty for primary locale
  // This is a simplified version - a real implementation might have more validation
  const error = undefined;

  return {
    inputId,
    value: currentValue || "",
    onChange,
    currency: currentCurrency,
    currencies: CurrencySchema.options as DBCurrency[],
    setCurrency,
    error,
  };
}
