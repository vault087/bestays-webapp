import { ColumnDef } from "@tanstack/react-table";
import { PropertyImage } from "./property-image";
import { PropertyStatus } from "./property-status";
import { PublishedStatus } from "./published-status";
import { RelativeTimeCell } from "./relative-time-cell";
import { PropertyRow } from "./types";

export const createPropertyColumns = (): ColumnDef<PropertyRow>[] => [
  {
    accessorKey: "cover_image",
    header: "",
    cell: ({ row }) => <PropertyImage coverImage={row.getValue("cover_image")} />,
    enableSorting: false,
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-xs">{row.getValue<string>("id").slice(0, 8)}</span>
    ),
  },
  {
    accessorKey: "personal_title",
    header: "Title",
    cell: ({ row }) => {
      const title = row.getValue<string>("personal_title");
      return title ? (
        <span className="font-medium">{title}</span>
      ) : (
        <span className="text-muted-foreground italic">No title</span>
      );
    },
  },
  {
    accessorKey: "property_type",
    header: "Property Type",
    cell: ({ row }) => {
      const type = row.getValue<string>("property_type");
      return type || <span className="text-muted-foreground">—</span>;
    },
    filterFn: (row, columnId, filterValue) => {
      const propertyTypeId = row.original.property_type_id;
      return filterValue === "all" || propertyTypeId?.toString() === filterValue;
    },
    meta: { filterVariant: "select" },
  },
  {
    accessorKey: "area",
    header: "Area",
    cell: ({ row }) => {
      const area = row.getValue<string>("area");
      return area || <span className="text-muted-foreground">—</span>;
    },
    filterFn: (row, columnId, filterValue) => {
      const areaId = row.original.area_id;
      return filterValue === "all" || areaId?.toString() === filterValue;
    },
    meta: { filterVariant: "select" },
  },
  {
    accessorKey: "rent_price",
    header: "Rent Price",
    cell: ({ row }) => {
      const price = row.getValue<number>("rent_price");
      const enabled = row.original.rent_enabled;
      if (!enabled) return <span className="text-muted-foreground">—</span>;
      return price ? (
        <span className="font-medium">₿{price.toLocaleString()}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "sale_price",
    header: "Sale Price",
    cell: ({ row }) => {
      const price = row.getValue<number>("sale_price");
      const enabled = row.original.sale_enabled;
      if (!enabled) return <span className="text-muted-foreground">—</span>;
      return price ? (
        <span className="font-medium">₿{price.toLocaleString()}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "rent_enabled",
    header: "For Rent",
    cell: ({ row }) => (row.original.rent_enabled ? "Yes" : "No"),
    enableSorting: false,
  },
  {
    accessorKey: "sale_enabled",
    header: "For Sale",
    cell: ({ row }) => (row.original.sale_enabled ? "Yes" : "No"),
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <PropertyStatus rent_enabled={row.original.rent_enabled} sale_enabled={row.original.sale_enabled} />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "is_published",
    header: "Published",
    cell: ({ row }) => <PublishedStatus is_published={row.getValue("is_published")} />,
    meta: { filterVariant: "select" },
  },
  {
    accessorKey: "updated_at",
    header: "Updated",
    cell: ({ row }) => <RelativeTimeCell date={row.getValue("updated_at")} />,
  },
];
