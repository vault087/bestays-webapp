import { DBDictionary, DBDictionaryEntry } from "@/entities/dictionaries";
import { DashboardProperty } from "@/entities/properties-sale-rent/libs/load-properties";

export interface PropertyListingProps {
  properties: DashboardProperty[];
  dictionaries: DBDictionary[];
  entries: DBDictionaryEntry[];
  locale: string;
}

export interface PropertyRow {
  id: string;
  personal_title: string | null;
  property_type: string | null;
  area: string | null;
  rent_price: number | null;
  sale_price: number | null;
  rent_enabled: boolean | null;
  sale_enabled: boolean | null;
  cover_image: { url?: string } | null;
  is_published: boolean | null;
  updated_at: string | null;
  // Original IDs for filtering
  property_type_id?: number | null;
  area_id?: number | null;
}
