import { z } from "zod";

export const DBMoneySchema = z.number().int().positive();
export type DBMoney = z.infer<typeof DBMoneySchema>;
