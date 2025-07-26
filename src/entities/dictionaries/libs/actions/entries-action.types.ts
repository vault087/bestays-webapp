import { z } from "zod";
import { DBDictionaryEntry, DBDictionaryEntrySchema } from "@/entities/dictionaries";

export type DBEntryResponse = Promise<{
  data: DBDictionaryEntry | null;
  error: string | null;
}>;

export const DBDictionaryInsertEntrySchema = DBDictionaryEntrySchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});
export type DBDictionaryInsertEntry = z.infer<typeof DBDictionaryInsertEntrySchema>;
