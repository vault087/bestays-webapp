import { z } from "zod";
import { DBSerialIDSchema } from "@/entities/dictionaries/types/shared-db.types";
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

export const CurrencySchema = z.enum(["thb"]);
export const DEFAULT_CURRENCY: DBCurrency = "thb";

export const DBMoneySchema = z.number().int().positive();
export const DBPriceSchema = z.object({
  currency: CurrencySchema.nullish(),
  rai: DBMoneySchema.nullish(),
  total: DBMoneySchema.nullish(),
  sale: DBMoneySchema.nullish(),
});

export type DBPrice = z.infer<typeof DBPriceSchema>;
export type DBSize = z.infer<typeof DBSizeSchema>;
export type DBSizeEntry = z.infer<typeof DBSizeEntrySchema>;
export type DBRooms = z.infer<typeof DBRoomsSchema>;
export type DBCurrency = z.infer<typeof CurrencySchema>;
export type DBMoney = z.infer<typeof DBMoneySchema>;

// Database Schemas
export const DBPropertySchema = z.object({
  id: z.string().uuid(),
  about: LocalizedTextSchema.nullish(),

  ownership_type: DBSerialIDSchema.nullish(),
  property_type: DBSerialIDSchema.nullish(),
  area: DBSerialIDSchema.nullish(),
  divisible_sale: DBSerialIDSchema.nullish(),

  highlights: z.array(DBSerialIDSchema).nullish(),
  location_strengths: z.array(DBSerialIDSchema).nullish(),
  transaction_types: z.array(DBSerialIDSchema).nullish(),
  land_features: z.array(DBSerialIDSchema).nullish(),
  nearby_attractions: z.array(DBSerialIDSchema).nullish(),
  land_and_construction: z.array(DBSerialIDSchema).nullish(),

  rooms: DBRoomsSchema.nullish(),
  size: DBSizeSchema.nullish(),
  price: DBPriceSchema.nullish(),
  images: z.array(DBImageSchema).nullish(),

  agent_notes: z.string().nullish(),
  agent_id: z.string().uuid().nullish(),

  is_published: z.boolean().default(false),

  created_by: z.string().uuid().nullish(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
  deleted_at: z.string().nullish(),
});

// Types
export type DBProperty = z.infer<typeof DBPropertySchema>;
