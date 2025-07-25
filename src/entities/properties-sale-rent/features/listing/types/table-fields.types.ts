import React from "react";
import { PropertyRow } from "@/entities/properties-sale-rent/features/listing/components/types";
import { DashboardProperty } from "@/entities/properties-sale-rent/libs/load-properties";
import { PropertyImage } from "@/entities/properties-sale-rent/features/listing/components/property-image";
import { PublishedStatus } from "@/entities/properties-sale-rent/features/listing/components/published-status";
import { RelativeTimeCell } from "@/entities/properties-sale-rent/features/listing/components/relative-time-cell";

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
 * Table field configuration array with custom renderers
 * Defines all table columns with their properties and rendering logic
 */
export const TABLE_FIELDS_CONFIG: TableFieldConfig[] = [
  {
    key: "cover_image",
    title: "",
    sortable: false,
    filterable: false,
    width: "60px",
    align: "center",
    render: (value, row) => <PropertyImage coverImage={row.cover_image} />,
  },
  {
    key: "id",
    title: "ID",
    sortable: true,
    filterable: false,
    width: "100px",
    align: "left",
    render: (value) => (
      <span className="text-muted-foreground font-mono text-xs">
        {typeof value === "string" ? value.slice(0, 8) : "—"}
      </span>
    ),
  },
  {
    key: "personal_title",
    title: "Title",
    sortable: true,
    filterable: false,
    width: "1fr",
    align: "left",
    render: (value) => {
      const title = value as string | null;
      return title ? (
        <span className="font-medium">{title}</span>
      ) : (
        <span className="text-muted-foreground italic">No title</span>
      );
    },
  },
  {
    key: "property_type",
    title: "Property type",
    sortable: true,
    filterable: true,
    width: "150px",
    align: "left",
    render: (value) => (
      <span className="text-sm">
        {value || <span className="text-muted-foreground">—</span>}
      </span>
    ),
  },
  {
    key: "area",
    title: "Area",
    sortable: true,
    filterable: true,
    width: "150px",
    align: "left",
    render: (value) => (
      <span className="text-sm">
        {value || <span className="text-muted-foreground">—</span>}
      </span>
    ),
  },
  {
    key: "rent_enabled",
    title: "Rent",
    sortable: true,
    filterable: true,
    width: "120px",
    align: "center",
    render: (value, row) => {
      const enabled = value as boolean | null;
      if (enabled && row.rent_price) {
        return (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
            ฿{row.rent_price.toLocaleString()}
          </span>
        );
      }
      return enabled ? (
        <span className="text-green-600 text-xs">Enabled</span>
      ) : (
        <span className="text-muted-foreground text-xs">—</span>
      );
    },
  },
  {
    key: "sale_enabled",
    title: "Sale",
    sortable: true,
    filterable: true,
    width: "120px",
    align: "center",
    render: (value, row) => {
      const enabled = value as boolean | null;
      if (enabled && row.sale_price) {
        return (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
            ฿{row.sale_price.toLocaleString()}
          </span>
        );
      }
      return enabled ? (
        <span className="text-blue-600 text-xs">Enabled</span>
      ) : (
        <span className="text-muted-foreground text-xs">—</span>
      );
    },
  },
  {
    key: "is_published",
    title: "Published",
    sortable: true,
    filterable: true,
    width: "100px",
    align: "center",
    render: (value) => <PublishedStatus is_published={value as boolean | null} />,
  },
  {
    key: "updated_at",
    title: "Updated",
    sortable: true,
    filterable: false,
    width: "120px",
    align: "right",
    render: (value) => <RelativeTimeCell date={value as string | null} />,
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