import { DBCode } from "@/entities/common/";
import { DBProperty, DBRooms, DBSize } from "./property.types";

export type DBPropertyLocalizedTextField = keyof Pick<DBProperty, "about">;
export type DBPropertyTextField = keyof Pick<DBProperty, "agent_notes">;

export type DBPropertyCodeField = keyof Pick<
  DBProperty,
  "area" | "ownership_type" | "property_type" | "divisible_sale"
>;

export type DBPropertyMultiCodeField = keyof Pick<
  DBProperty,
  "location_strengths" | "highlights" | "land_features" | "nearby_attractions" | "land_and_construction"
>;

export type DBPropertySizeField = keyof DBSize;
export type DBPropertyPriceField = keyof Pick<DBProperty, "rent_price" | "sale_price">;
export type DBPropertyRoomsField = keyof DBRooms;

export const PropertyFieldToDictionaryCodeMap: Record<
  DBPropertyMultiCodeField | DBPropertyCodeField | "size.unit",
  DBCode
> = {
  // Multi-code fields
  area: "areas",
  divisible_sale: "divisible_sale_types",
  ownership_type: "ownership_types",
  property_type: "property_types",
  location_strengths: "location_strengths",
  highlights: "highlights",
  land_features: "land_features",
  nearby_attractions: "nearby_attractions",
  land_and_construction: "land_and_construction",
  "size.unit": "measurement_units",
};
