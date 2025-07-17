import { z } from "zod";

export const DBCodeSchema = z.string().min(1).max(50);
export const DBSerialIDSchema = z.number().int().positive();

export type DBCode = z.infer<typeof DBCodeSchema>;
export type DBSerialID = z.infer<typeof DBSerialIDSchema>;
