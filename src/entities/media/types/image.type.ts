import { z } from "zod";

export const DBImageSchema = z.object({
  url: z.string(),
  color: z.string().nullish(),
  order: z.number().int().positive().nullish(),
  alt: z.string().nullish(),
});

export type DBImage = z.infer<typeof DBImageSchema>;
