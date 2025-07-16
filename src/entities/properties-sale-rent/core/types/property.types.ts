import { z } from "zod";
import { DBCodeSchema } from "@/entities/dictionaries/types/dictionary.types";
import { LocalizedTextSchema } from "@/entities/localized-text";
import { DBImageSchema } from "@/entities/media/types/image.type";

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

export const CurrencySchema = z.enum(["thb"]);
export const DBMoneySchema = z.number().int().positive();

export const DBPriceSchema = z.object({
  currency: CurrencySchema.nullish(),
  rai: DBMoneySchema.nullish(),
  total: DBMoneySchema.nullish(),
  sale: DBMoneySchema.nullish(),
});

export type DBPrice = z.infer<typeof DBPriceSchema>;
export type DBSize = z.infer<typeof DBSizeSchema>;
export type DBRoomCounts = z.infer<typeof DBRoomCountsSchema>;
export type DBCurrency = z.infer<typeof CurrencySchema>;
export type DBMoney = z.infer<typeof DBMoneySchema>;

// Database Schemas
export const DBPropertySchema = z.object({
  id: z.string().uuid(),
  about: LocalizedTextSchema.nullish(),

  ownership_type: DBCodeSchema.nullish(),
  property_type: DBCodeSchema.nullish(),
  area: DBCodeSchema.nullish(),
  divisible_sale: DBCodeSchema.nullish(),

  highlights: z.array(DBCodeSchema).nullish(),
  location_strengths: z.array(DBCodeSchema).nullish(),
  transaction_types: z.array(DBCodeSchema).nullish(),
  land_features: z.array(DBCodeSchema).nullish(),
  nearby_attractions: z.array(DBCodeSchema).nullish(),
  land_and_construction: z.array(DBCodeSchema).nullish(),

  room_counts: DBRoomCountsSchema.nullish(),
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
