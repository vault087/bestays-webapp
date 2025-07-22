import { z } from "zod";

export const SUPPORTED_CURRENCIES = ["THB"] as const;
export const DBCurrencySchema = z.enum(SUPPORTED_CURRENCIES);
export type DBCurrency = z.infer<typeof DBCurrencySchema>;
export const DEFAULT_CURRENCY: DBCurrency = "THB" as const;

export function getCurrencySymbol(currency: DBCurrency): string {
  switch (currency) {
    case "THB":
      return "฿";
  }
}

export const formatCurrency = (
  amount: string,
  locale: string,
  currency: string,
  display: "number" | "symbol" | "name" | "code",
): string => {
  if (!amount) return "";

  const numericValue = Number(amount.replace(/[^0-9.]/g, "")); // Remove non-numeric chars except dot
  switch (display) {
    case "number":
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        currencyDisplay: "code",
      })
        .format(numericValue)
        .replace(currency, "")
        .trim();
    case "symbol":
    case "name":
    case "code":
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        currencyDisplay: display,
      }).format(numericValue);
  }
};
