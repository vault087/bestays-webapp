import { z } from "zod";

type ZodNullableString = z.ZodOptional<z.ZodNullable<z.ZodString>>;
export const LocalizedTextSchema = (maxLength: number): z.ZodRecord<z.ZodString, ZodNullableString> =>
  z.record(z.string().min(2).max(5), z.string().max(maxLength).nullish());

export type LocalizedText = z.infer<ReturnType<typeof LocalizedTextSchema>>;
