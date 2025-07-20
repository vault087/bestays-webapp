"use client";
import { useCallback, useId, useState } from "react";
import { DEFAULT_CURRENCY, DBCurrency, DBCurrencySchema } from "@/entities/common";
import {
  DBPropertyPriceField,
  usePropertyFormStaticStore,
  usePropertyFormStoreActions,
} from "@/entities/properties-sale-rent";

// Input hook for MutableProperty localized fields
export function usePropertyPriceInput(field: DBPropertyPriceField): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  currency: DBCurrency;
  currencies: DBCurrency[];
  setCurrency: (currency: DBCurrency) => void;
  error?: string;
} {
  const { property } = usePropertyFormStaticStore();
  const { updateProperty } = usePropertyFormStoreActions();
  const inputId = useId();

  const priceFieldValue = property.price?.[field] as number | undefined;

  const [currentCurrency, setCurrentCurrency] = useState<DBCurrency>(property.price?.currency || DEFAULT_CURRENCY);
  const [priceValue, setPriceValue] = useState<string>(priceFieldValue?.toString() || "");

  // Handle change
  const onChange = useCallback(
    (value: string) => {
      setPriceValue(value);
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

  const error = undefined;

  return {
    inputId,
    value: priceValue,
    onChange,
    currency: currentCurrency,
    currencies: DBCurrencySchema.options,
    setCurrency,
    error,
  };
}
