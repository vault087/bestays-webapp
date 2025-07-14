import { z } from "zod";
import { Code, DBCodeSchema } from "@/entities/dictionaries/types/dictionary.types";
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

export type PropertyMultiCodeField = keyof Pick<
  Property,
  | "location_strengths"
  | "highlights"
  | "transaction_types"
  | "land_features"
  | "nearby_attractions"
  | "land_and_construction"
>;

export type PropertyCodeField = keyof Pick<Property, "area" | "ownership_type" | "property_type" | "divisible_sale">;
export type PropertyLocalizedTextField = "title" | "description";
export type PropertyTextField = "notes" | "additional_info";

export const covertPropertyFieldToDictionaryCode: Record<PropertyMultiCodeField | PropertyCodeField, Code> = {
  // Multi-code fields
  area: "areas",
  divisible_sale: "divisible_sale_types",
  ownership_type: "ownership_types",
  property_type: "property_types",
  location_strengths: "location_strengths",
  highlights: "highlights",
  transaction_types: "transaction_types",
  land_features: "land_features",
  nearby_attractions: "nearby_attractions",
  land_and_construction: "land_and_construction",
};

// Form Schemas (extend DB schemas)
export const PropertySchema = DBPropertySchema.omit({
  created_by: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
}).extend({
  is_new: z.boolean().default(false),
});

// Types
export type DBProperty = z.infer<typeof DBPropertySchema>;
export type Property = z.infer<typeof PropertySchema>;
