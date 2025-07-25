import { DBProperty, DBPropertySchema, PROPERTIES_SALE_RENT_TABLE } from "@/entities/properties-sale-rent";
import { fetch } from "@/modules/supabase/crud/fetch";

const DASHBOARD_LISTING_FIELDS: (keyof DBProperty)[] = [
  "id",
  "personal_title",
  "property_type",
  "area",
  "rent_price",
  "sale_price",
  "rent_enabled",
  "sale_enabled",
  "cover_image",
  "is_published",
  "updated_at",
  "deleted_at",
];

export type DashboardProperty = Pick<DBProperty, (typeof DASHBOARD_LISTING_FIELDS)[number]>;

export function loadDashboardPropertyListings(): ReturnType<typeof fetch> {
  return fetch(PROPERTIES_SALE_RENT_TABLE, DBPropertySchema, DASHBOARD_LISTING_FIELDS);
}

export function loadDashboardPropertyDetails(): ReturnType<typeof fetch> {
  return fetch(
    PROPERTIES_SALE_RENT_TABLE,
    DBPropertySchema,
    Object.keys(DBPropertySchema.shape) as (keyof typeof DBPropertySchema.shape)[],
  );
}
