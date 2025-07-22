import { z } from "zod";

export const DBMoneySchema = z.number().int().positive();
export type DBMoney = z.infer<typeof DBMoneySchema>;

export const stringToMoney = (amount?: string | undefined | null): DBMoney | undefined => {
  if (!amount) return undefined;
  return Math.round(Number(amount) * 100);
};

export const moneyToString = (amount?: DBMoney | undefined | null): string => {
  if (!amount) return "";
  return (amount / 100).toString();
};

export const formatMoneyDisplay = (
  amount: string,
  locale: string,
  currency: string,
  display: "number" | "narrowSymbol" | "name" | "code",
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
    case "narrowSymbol":
    case "name":
    case "code":
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        currencyDisplay: display,
      }).format(numericValue);
  }
};
