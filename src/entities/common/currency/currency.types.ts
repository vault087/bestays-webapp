import { z } from "zod";

export const SUPPORTED_CURRENCIES = ["thb"] as const;
export const DBCurrencySchema = z.enum(SUPPORTED_CURRENCIES);
export type DBCurrency = z.infer<typeof DBCurrencySchema>;
export const DEFAULT_CURRENCY: DBCurrency = "thb" as const;

export function getCurrencySymbol(currency: DBCurrency): string {
  switch (currency) {
    case "thb":
      return "฿";
  }
}
