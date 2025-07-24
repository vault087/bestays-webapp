import { z } from "zod";
import { DBMoneySchema, DBSerialIDSchema } from "@/entities/common";
import { LocalizedTextSchema } from "@/entities/localized-text";
import { DBImageSchema } from "@/entities/media/types/image.type";
// Table constants
export const PROPERTIES_SALE_RENT_TABLE = "properties_sale_rent";

export const DBSizeEntrySchema = z.object({
  value: z.number().positive(),
  unit: DBSerialIDSchema,
});

export const DBSizeSchema = z.object({
  total: DBSizeEntrySchema.nullish(),
});

export const DBRoomsSchema = z.object({
  bedrooms: z.number().int().positive().nullish(),
  bathrooms: z.number().int().positive().nullish(),
  living_rooms: z.number().int().positive().nullish(),
});

export type DBSize = z.infer<typeof DBSizeSchema>;
export type DBSizeEntry = z.infer<typeof DBSizeEntrySchema>;
export type DBRooms = z.infer<typeof DBRoomsSchema>;

export const PROPERTY_ABOUT_MAX = 5000;
export const PROPERTY_PERSONAL_NOTES_MAX = 5000;
export const PROPERTY_TITLE_MAX = 50;

export const PROPERTY_MAX_IMAGES = 30;

// Database Schemas
export const DBPropertySchema = z.object({
  id: z.string().uuid(),
  personal_title: z.string().max(PROPERTY_TITLE_MAX).nullish(),
  about: LocalizedTextSchema(PROPERTY_ABOUT_MAX).nullish(),

  ownership_type: DBSerialIDSchema.nullish(),
  property_type: DBSerialIDSchema.nullish(),
  area: DBSerialIDSchema.nullish(),
  divisible_sale: DBSerialIDSchema.nullish(),

  highlights: z.array(DBSerialIDSchema).nullish(),
  location_strengths: z.array(DBSerialIDSchema).nullish(),
  land_features: z.array(DBSerialIDSchema).nullish(),
  nearby_attractions: z.array(DBSerialIDSchema).nullish(),
  land_and_construction: z.array(DBSerialIDSchema).nullish(),

  rent_price: DBMoneySchema.nullish(),
  sale_price: DBMoneySchema.nullish(),
  sale_enabled: z.boolean().nullish(),
  rent_enabled: z.boolean().nullish(),

  rooms: DBRoomsSchema.nullish(),
  size: DBSizeSchema.nullish(),
  images: z.array(DBImageSchema).nullish(),

  personal_notes: z.string().max(PROPERTY_PERSONAL_NOTES_MAX).nullish(),
  agent_id: z.string().uuid().nullish(),

  is_published: z.boolean().nullish(),

  created_by: z.string().uuid().nullish(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
  deleted_at: z.string().nullish(),
});

// Types
export type DBProperty = z.infer<typeof DBPropertySchema>;
