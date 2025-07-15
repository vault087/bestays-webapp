import { z } from "zod";
import { DBCodeSchema } from "@/entities/dictionaries/types/dictionary.types";
import { LocalizedTextSchema } from "@/entities/localized-text";
import { DBImageSchema } from "@/entities/media/types/image.type";
import { DBPriceSchema } from "./price.type";

// Table constants
export const PROPERTIES_SALE_RENT_TABLE = "properties_sale_rent";

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
  title: LocalizedTextSchema.nullish(),
  description: LocalizedTextSchema.nullish(),
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
  land_and_construction: z.array(DBCodeSchema).nullish(),

  additional_info: z.string().nullish(),
  images: z.array(DBImageSchema).nullish(),
  is_published: z.boolean().default(false),

  created_by: z.string().nullish(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
  deleted_at: z.string().nullish(),
});

// Types
export type DBProperty = z.infer<typeof DBPropertySchema>;
