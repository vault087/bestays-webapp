import { PropertyRow } from "@/entities/properties-sale-rent/features/listing/components/types";
import { DashboardProperty } from "@/entities/properties-sale-rent/libs/load-properties";

/**
 * Configuration for a single table field
 * Follows project pattern of clear interface definitions
 */
export interface TableFieldConfig<T = unknown> {
  key: keyof DashboardProperty;
  title: string;
  sortable: boolean;
  filterable: boolean;
  width: string; // CSS Grid column width
  align: "left" | "center" | "right";
  render?: (value: T, row: PropertyRow) => React.ReactNode;
}

/**
 * Sorted array of field keys for table rendering
 * Uses Pick<DashboardProperty> pattern from existing codebase
 */
export const DISPLAY_FIELDS_ORDER: (keyof DashboardProperty)[] = [
  "cover_image",
  "id",
  "personal_title",
  "property_type",
  "area",
  "rent_enabled",
  "sale_enabled",
  "is_published",
  "updated_at",
] as const;

/**
 * Type-safe field selection using Pick utility
 * Follows existing codebase pattern for field typing
 */
export type DisplayProperty = Pick<DashboardProperty, (typeof DISPLAY_FIELDS_ORDER)[number]>;

/**
 * Table field configuration array
 * Defines all table columns with their properties
 */
export const TABLE_FIELDS_CONFIG: TableFieldConfig[] = [
  {
    key: "cover_image",
    title: "",
    sortable: false,
    filterable: false,
    width: "60px",
    align: "center",
  },
  {
    key: "id",
    title: "ID",
    sortable: true,
    filterable: false,
    width: "100px",
    align: "left",
  },
  {
    key: "personal_title",
    title: "Title",
    sortable: true,
    filterable: false,
    width: "1fr",
    align: "left",
  },
  {
    key: "property_type",
    title: "Property type",
    sortable: true,
    filterable: true,
    width: "150px",
    align: "left",
  },
  {
    key: "area",
    title: "Area",
    sortable: true,
    filterable: true,
    width: "150px",
    align: "left",
  },
  {
    key: "rent_enabled",
    title: "Rent",
    sortable: true,
    filterable: true,
    width: "120px",
    align: "center",
  },
  {
    key: "sale_enabled",
    title: "Sale",
    sortable: true,
    filterable: true,
    width: "120px",
    align: "center",
  },
  {
    key: "is_published",
    title: "Published",
    sortable: true,
    filterable: true,
    width: "100px",
    align: "center",
  },
  {
    key: "updated_at",
    title: "Updated",
    sortable: true,
    filterable: false,
    width: "120px",
    align: "right",
  },
] as const;

/**
 * Auto-generated CSS Grid template from field configuration
 * Follows project pattern of computed constants
 */
export const GRID_TEMPLATE_COLUMNS = TABLE_FIELDS_CONFIG.map((field) => field.width).join(" ");

/**
 * Type helper for field keys - ensures type safety
 */
export type TableFieldKey = (typeof TABLE_FIELDS_CONFIG)[number]["key"];

/**
 * Type helper for sortable fields only
 */
export type SortableFieldKey = Extract<
  TableFieldKey,
  (typeof TABLE_FIELDS_CONFIG)[number] extends { sortable: true; key: infer K } ? K : never
>;

/**
 * Type helper for filterable fields only
 */
export type FilterableFieldKey = Extract<
  TableFieldKey,
  (typeof TABLE_FIELDS_CONFIG)[number] extends { filterable: true; key: infer K } ? K : never
>; 