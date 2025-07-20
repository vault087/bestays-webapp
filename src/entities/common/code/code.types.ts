import { z } from "zod";

export const DB_CODE_MAX = 50;

export const DBCodeSchema = z.string().min(1).max(DB_CODE_MAX);
export type DBCode = z.infer<typeof DBCodeSchema>;
