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
  price: string;
  onPriceChange: (value: string) => void;
  currency: DBCurrency;
  currencies: DBCurrency[];
  setCurrency: (currency: DBCurrency) => void;
  error?: string;
} {
  const inputId = useId();

  const { property } = usePropertyFormStaticStore();
  const { updateProperty } = usePropertyFormStoreActions();
  const [currentCurrency, setCurrentCurrency] = useState<DBCurrency>(property.price?.currency || DEFAULT_CURRENCY);
  const [priceValue, setPriceValue] = useState<string>(property.price?.[field]?.toString() || "");

  // Handle change
  const onPriceChange = useCallback(
    (value: string) => {
      setPriceValue(value);
      updateProperty((draft) => {
        if (!draft.price) {
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
    price: priceValue,
    onPriceChange,
    currency: currentCurrency,
    currencies: DBCurrencySchema.options,
    setCurrency,
    error,
  };
}
