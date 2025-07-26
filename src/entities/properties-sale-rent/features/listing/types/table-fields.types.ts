import type { ReactNode } from "react";
import type { DashboardProperty } from "@/entities/properties-sale-rent/libs/load-properties";

// Define available field keys from DashboardProperty
export type TableFieldKey = keyof DashboardProperty;

// Define which fields can be sorted
export type SortableFieldKey = Exclude<TableFieldKey, "cover_image">;

// Define which fields can be filtered
export type FilterableFieldKey = "property_type" | "area" | "is_published" | "sale_enabled" | "rent_enabled";

// Table field configuration interface
export interface TableFieldConfig<TFieldKey extends TableFieldKey = TableFieldKey> {
  key: TFieldKey;
  label: string;
  sortable: boolean;
  filterable: boolean;
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
  cellRenderer?: (value: unknown, row: DashboardProperty) => ReactNode;
  minWidth?: string;
}

// Display field order using Pick<DashboardProperty> pattern
export const DISPLAY_FIELDS_ORDER: TableFieldKey[] = [
  "cover_image", // Product/Image
  "personal_title", // Title
  "property_type", // Type
  "area", // Area/Location
  "rent_enabled", // Rent
  "sale_enabled", // Sale
  "is_published", // Status
  "updated_at", // Last Updated
] as const;

// Table field configuration with JSON styling reference
export const TABLE_FIELDS_CONFIG: Record<TableFieldKey, TableFieldConfig> = {
  cover_image: {
    key: "cover_image",
    label: "",
    sortable: false,
    filterable: false,
    className: "w-16 px-4 py-3",
    headerClassName: "w-16 px-4 py-3",
    cellClassName: "w-16 px-4 py-4",
    minWidth: "64px",
  },
  personal_title: {
    key: "personal_title",
    label: "Property Title",
    sortable: false,
    filterable: false,
    className: "px-4 py-3 text-left text-sm font-medium text-gray-700",
    headerClassName: "px-4 py-3 text-left text-sm font-medium text-gray-700",
    cellClassName: "px-4 py-4 text-sm",
    minWidth: "200px",
  },
  property_type: {
    key: "property_type",
    label: "Property Type",
    sortable: false,
    filterable: false,
    className: "px-4 py-3 text-left text-sm font-medium text-gray-700",
    headerClassName: "px-4 py-3 text-left text-sm font-medium text-gray-700",
    cellClassName: "px-4 py-4 text-sm text-gray-900",
    minWidth: "150px",
  },
  area: {
    key: "area",
    label: "Area",
    sortable: false,
    filterable: false,
    className: "px-4 py-3 text-left text-sm font-medium text-gray-700",
    headerClassName: "px-4 py-3 text-left text-sm font-medium text-gray-700",
    cellClassName: "px-4 py-4 text-sm text-gray-900",
    minWidth: "120px",
  },
  sale_price: {
    key: "sale_price",
    label: "Sale Price",
    sortable: false,
    filterable: false,
    className: "hidden",
    headerClassName: "hidden",
    cellClassName: "hidden",
  },
  rent_price: {
    key: "rent_price",
    label: "Rent Price",
    sortable: false,
    filterable: false,
    className: "hidden",
    headerClassName: "hidden",
    cellClassName: "hidden",
  },
  is_published: {
    key: "is_published",
    label: "Status",
    sortable: false,
    filterable: false,
    className: "px-4 py-3 text-left text-sm font-medium text-gray-700",
    headerClassName: "px-4 py-3 text-left text-sm font-medium text-gray-700",
    cellClassName: "px-4 py-4 text-sm",
    minWidth: "100px",
  },
  updated_at: {
    key: "updated_at",
    label: "Last Updated",
    sortable: false,
    filterable: false,
    className: "px-4 py-3 text-left text-sm font-medium text-gray-700",
    headerClassName: "px-4 py-3 text-left text-sm font-medium text-gray-700",
    cellClassName: "px-4 py-4 text-sm text-gray-500",
    minWidth: "1fr",
  },
  // Hidden fields that exist in DashboardProperty but not displayed
  id: {
    key: "id",
    label: "ID",
    sortable: false,
    filterable: false,
    className: "hidden",
    headerClassName: "hidden",
    cellClassName: "hidden",
  },
  rent_enabled: {
    key: "rent_enabled",
    label: "Rent",
    sortable: false,
    filterable: false,
    className: "px-4 py-3 text-right text-sm font-medium text-gray-700",
    headerClassName: "px-4 py-3 text-right text-sm font-medium text-gray-700",
    cellClassName: "px-4 py-4 text-right text-sm",
    minWidth: "120px",
  },
  sale_enabled: {
    key: "sale_enabled",
    label: "Sale",
    sortable: false,
    filterable: false,
    className: "px-4 py-3 text-right text-sm font-medium text-gray-700",
    headerClassName: "px-4 py-3 text-right text-sm font-medium text-gray-700",
    cellClassName: "px-4 py-4 text-right text-sm",
    minWidth: "120px",
  },
  about: {
    key: "about",
    label: "About",
    sortable: false,
    filterable: false,
    className: "hidden",
    headerClassName: "hidden",
    cellClassName: "hidden",
  },
  ownership_type: {
    key: "ownership_type",
    label: "Ownership Type",
    sortable: false,
    filterable: false,
    className: "hidden",
    headerClassName: "hidden",
    cellClassName: "hidden",
  },
  divisible_sale: {
    key: "divisible_sale",
    label: "Divisible Sale",
    sortable: false,
    filterable: false,
    className: "hidden",
    headerClassName: "hidden",
    cellClassName: "hidden",
  },
  highlights: {
    key: "highlights",
    label: "Highlights",
    sortable: false,
    filterable: false,
    className: "hidden",
    headerClassName: "hidden",
    cellClassName: "hidden",
  },
  location_strengths: {
    key: "location_strengths",
    label: "Location Strengths",
    sortable: false,
    filterable: false,
    className: "hidden",
    headerClassName: "hidden",
    cellClassName: "hidden",
  },
  land_features: {
    key: "land_features",
    label: "Land Features",
    sortable: false,
    filterable: false,
    className: "hidden",
    headerClassName: "hidden",
    cellClassName: "hidden",
  },
  nearby_attractions: {
    key: "nearby_attractions",
    label: "Nearby Attractions",
    sortable: false,
    filterable: false,
    className: "hidden",
    headerClassName: "hidden",
    cellClassName: "hidden",
  },
  land_and_construction: {
    key: "land_and_construction",
    label: "Land and Construction",
    sortable: false,
    filterable: false,
    className: "hidden",
    headerClassName: "hidden",
    cellClassName: "hidden",
  },
  rooms: {
    key: "rooms",
    label: "Rooms",
    sortable: false,
    filterable: false,
    className: "hidden",
    headerClassName: "hidden",
    cellClassName: "hidden",
  },
  size: {
    key: "size",
    label: "Size",
    sortable: false,
    filterable: false,
    className: "hidden",
    headerClassName: "hidden",
    cellClassName: "hidden",
  },
  images: {
    key: "images",
    label: "Images",
    sortable: false,
    filterable: false,
    className: "hidden",
    headerClassName: "hidden",
    cellClassName: "hidden",
  },
  personal_notes: {
    key: "personal_notes",
    label: "Personal Notes",
    sortable: false,
    filterable: false,
    className: "hidden",
    headerClassName: "hidden",
    cellClassName: "hidden",
  },
  agent_id: {
    key: "agent_id",
    label: "Agent ID",
    sortable: false,
    filterable: false,
    className: "hidden",
    headerClassName: "hidden",
    cellClassName: "hidden",
  },
  created_by: {
    key: "created_by",
    label: "Created By",
    sortable: false,
    filterable: false,
    className: "hidden",
    headerClassName: "hidden",
    cellClassName: "hidden",
  },
  created_at: {
    key: "created_at",
    label: "Created At",
    sortable: false,
    filterable: false,
    className: "hidden",
    headerClassName: "hidden",
    cellClassName: "hidden",
  },
  deleted_at: {
    key: "deleted_at",
    label: "Deleted At",
    sortable: false,
    filterable: false,
    className: "hidden",
    headerClassName: "hidden",
    cellClassName: "hidden",
  },
} as const;

// Get visible fields in order
export const VISIBLE_FIELDS = DISPLAY_FIELDS_ORDER.filter(
  (key) => !TABLE_FIELDS_CONFIG[key].className?.includes("hidden"),
);

// Generate CSS Grid template from visible fields
export const GRID_TEMPLATE_COLUMNS = VISIBLE_FIELDS.map((key) => TABLE_FIELDS_CONFIG[key].minWidth || "1fr").join(" ");

// Type helpers
export type VisibleFieldKey = (typeof VISIBLE_FIELDS)[number];
export type TableFieldConfigMap = typeof TABLE_FIELDS_CONFIG;
