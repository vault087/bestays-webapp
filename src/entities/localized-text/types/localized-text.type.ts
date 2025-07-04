import { z } from "zod";

export const LocalizedTextSchema = z.record(z.string().min(2).max(5), z.string().optional());
export type LocalizedText = z.infer<typeof LocalizedTextSchema>;
