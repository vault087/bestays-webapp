import { z } from "zod";

export const DBImageSchema = z.object({
  url: z.string(),
  color: z.string().nullish(),
  description: z.string().nullish(),
});

export const ImageSchema = DBImageSchema;
