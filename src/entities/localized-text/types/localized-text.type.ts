import { z } from "zod";

const LocalizedTextSchema = z.record(z.string().min(2).max(5), z.string().nullish());

type LocalizedText = z.infer<typeof LocalizedTextSchema>;

export type { LocalizedText, LocalizedTextSchema };
