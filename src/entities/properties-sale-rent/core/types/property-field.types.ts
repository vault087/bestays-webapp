import { DBCode } from "@/entities/dictionaries/types/dictionary.types";
import { DBPrice, DBProperty, DBRoomCounts } from "./property.types";

export type DBPropertyLocalizedTextField = keyof Pick<DBProperty, "about">;
export type DBPropertyTextField = keyof Pick<DBProperty, "agent_notes">;

export type DBPropertyCodeField = keyof Pick<
  DBProperty,
  "area" | "ownership_type" | "property_type" | "divisible_sale"
>;

export type DBPropertyMultiCodeField = keyof Pick<
  DBProperty,
  | "location_strengths"
  | "highlights"
  | "transaction_types"
  | "land_features"
  | "nearby_attractions"
  | "land_and_construction"
>;

export const covertPropertyFieldToDictionaryCode: Record<DBPropertyMultiCodeField | DBPropertyCodeField, DBCode> = {
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

export type DBPropertyPriceField = keyof Pick<DBPrice, "rai" | "total" | "sale">;
export type DBPropertyRoomCountsField = keyof Pick<DBRoomCounts, "bedrooms" | "bathrooms" | "living_rooms">;
