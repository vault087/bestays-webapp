import { z } from "zod";

export const CurrencySchema = z.enum(["thb"]);
export const MoneySchema = z.number().int().positive();

export const DBPriceSchema = z.object({
  currency: CurrencySchema.nullish(),
  rai: MoneySchema.nullish(),
  total: MoneySchema.nullish(),
  sale: MoneySchema.nullish(),
});
