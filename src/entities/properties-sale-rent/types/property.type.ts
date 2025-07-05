import { z } from "zod";
import { DBCodeSchema } from "@/entities/dictionaries/types/dictionary.types";
import { LocalizedTextSchema } from "@/entities/localized-text";
import { DBImageSchema } from "@/entities/media/types/image.type";
import { DBPriceSchema } from "./price.type";

// Table constants
export const PROPERTIES_SALE_RENT_TABLE = "dictionaries";

export const DBSizeSchema = z.object({
  value: z.number().positive().positive(),
  unit: DBCodeSchema,
});

export const DBRoomCountsSchema = z.object({
  bedrooms: z.number().int().positive(),
  bathrooms: z.number().int().positive(),
  living_rooms: z.number().int().positive(),
});

// Database Schemas
export const DBPropertySchema = z.object({
  id: z.string().uuid(),
  title: LocalizedTextSchema,
  description: LocalizedTextSchema,
  ownership_type: DBCodeSchema.nullish(),
  property_type: DBCodeSchema.nullish(),
  area: DBCodeSchema.nullish(),
  location_strengths: z.array(DBCodeSchema).nullish(),
  highlights: z.array(DBCodeSchema).nullish(),
  transaction_types: z.array(DBCodeSchema).nullish(),
  size: DBSizeSchema.nullish(),
  price: DBPriceSchema.nullish(),
  divisible_sale: DBCodeSchema.nullish(),
  notes: z.string().nullish(),
  land_features: z.array(DBCodeSchema).nullish(),
  room_counts: DBRoomCountsSchema.nullish(),
  nearby_attractions: z.array(DBCodeSchema).nullish(),
  land_and_construction: LocalizedTextSchema.nullish(),

  additional_info: z.string().nullish(),
  images: z.array(DBImageSchema).nullish(),
  is_published: z.boolean().default(false),

  createdAt: z.string().nullish(),
  updatedAt: z.string().nullish(),
  deletedAt: z.string().nullish(),
});

// Form Schemas (extend DB schemas)
export const PropertySchema = DBPropertySchema.omit({
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
}).extend({
  is_new: z.boolean().default(false),
});

// Types
export type DBProperty = z.infer<typeof DBPropertySchema>;
export type Property = z.infer<typeof PropertySchema>;
