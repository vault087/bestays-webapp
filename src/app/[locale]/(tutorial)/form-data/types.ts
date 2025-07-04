import { z } from "zod";

export const TextSchema = z.object({
  en: z.string(),
  th: z.string(),
});

export const OptionBaseSchema = z.object({
  id: z.string(),
  parentId: z.string(),
  name: TextSchema,
  order: z.number(),
  meta: z.object({
    url: z.string(),
    image: z.string(),
  }),
});

export const ItemsBaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  number: z.number(),
  options: z.array(OptionBaseSchema),
});

export const OptionWithTransformSchema = OptionBaseSchema.extend({
  order: z.number().or(z.string().transform(Number)),
});

export const ItemsWithTransformSchema = ItemsBaseSchema.extend({
  number: z.number().or(z.string().transform(Number)),
  options: z.array(OptionWithTransformSchema).default([]),
});

export const FormStateSchema = z.object({
  items: z.array(ItemsWithTransformSchema),
});

export type Text = z.infer<typeof TextSchema>;
export type OptionBase = z.infer<typeof OptionBaseSchema>;
export type ItemsBase = z.infer<typeof ItemsBaseSchema>;
export type OptionWithTransform = z.infer<typeof OptionWithTransformSchema>;
export type ItemsWithTransform = z.infer<typeof ItemsWithTransformSchema>;
export type FormState = z.infer<typeof FormStateSchema>;
