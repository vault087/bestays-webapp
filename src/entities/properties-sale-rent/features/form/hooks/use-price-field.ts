"use client";
import { useCallback, useId, useState } from "react";
import { DBCurrency, moneyToString, stringToMoney } from "@/entities/common";
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
  error?: string;
} {
  const inputId = useId();

  const { property } = usePropertyFormStaticStore();
  const { updateProperty } = usePropertyFormStoreActions();
  const [priceValue, setPriceValue] = useState<string>(moneyToString(property[field]));

  // Handle change
  const onPriceChange = useCallback(
    (value: string) => {
      setPriceValue(value);
      updateProperty((draft) => {
        draft[field] = stringToMoney(value);
      });
    },
    [updateProperty, field],
  );

  const error = undefined;

  return {
    inputId,
    price: priceValue,
    onPriceChange,
    currency: "THB",
    error,
  };
}
