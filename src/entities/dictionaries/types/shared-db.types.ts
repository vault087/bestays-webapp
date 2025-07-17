import { z } from "zod";

export const DBCodeSchema = z.string().min(1).max(50);
export const DBSerialIDSchema = z.number().int();
export const DBPermanentSerialIDSchema = DBSerialIDSchema.positive();
export const DBTemporarySerialIDSchema = DBSerialIDSchema.negative();

export type DBCode = z.infer<typeof DBCodeSchema>;
export type DBSerialID = z.infer<typeof DBSerialIDSchema>;
export type DBPermanentSerialID = z.infer<typeof DBPermanentSerialIDSchema>;
export type DBTemporarySerialID = z.infer<typeof DBTemporarySerialIDSchema>;
