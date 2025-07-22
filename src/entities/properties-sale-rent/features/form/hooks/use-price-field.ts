"use client";
import { useCallback, useId, useState } from "react";
import { DEFAULT_CURRENCY, DBCurrency, DBCurrencySchema } from "@/entities/common";
import {
  DBPropertyPriceField,
  usePropertyFormStaticStore,
  usePropertyFormStoreActions,
  usePropertyLocale,
} from "@/entities/properties-sale-rent";

// Input hook for MutableProperty localized fields
export function usePropertyPriceInput(field: DBPropertyPriceField): {
  inputId: string;
  price: string;
  priceFormatted: string;
  pricePreview: string;
  onPriceChange: (value: string) => void;
  currency: DBCurrency;
  currencies: DBCurrency[];
  setCurrency: (currency: DBCurrency) => void;
  error?: string;
} {
  const inputId = useId();

  const { property } = usePropertyFormStaticStore();
  const { updateProperty } = usePropertyFormStoreActions();
  const locale = usePropertyLocale();
  const [currentCurrency, setCurrentCurrency] = useState<DBCurrency>(property.price?.currency || DEFAULT_CURRENCY);
  const [priceValue, setPriceValue] = useState<string>(property.price?.[field]?.toString() || "");

  const formatCurrency = useCallback(
    (amount: string, symbol: boolean = false) => {
      if (!amount) return "";
      const numericValue = Number(amount.replace(/[^0-9.]/g, "")); // Remove non-numeric chars except dot
      if (symbol) {
        return new Intl.NumberFormat(locale, {
          style: "currency",
          currency: currentCurrency,
          currencyDisplay: "name",
        }).format(numericValue);
      } else {
        return new Intl.NumberFormat(locale, {
          style: "currency",
          currency: currentCurrency,
          currencyDisplay: "code",
        })
          .format(numericValue)
          .replace(currentCurrency, "")
          .trim();
      }
    },
    [locale, currentCurrency],
  );

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
    priceFormatted: formatCurrency(priceValue, false),
    pricePreview: formatCurrency(priceValue, true),
    onPriceChange,
    currency: currentCurrency,
    currencies: DBCurrencySchema.options,
    setCurrency,
    error,
  };
}
