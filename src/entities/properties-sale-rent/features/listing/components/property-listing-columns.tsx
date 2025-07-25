import { ColumnDef } from "@tanstack/react-table";
import { DBDictionary, DBDictionaryEntry } from "@/entities/dictionaries";
import { PropertyFieldToDictionaryCodeMap } from "@/entities/properties-sale-rent/types/property-fields.types";
import { BooleanHeaderFilter, DictionaryHeaderFilter } from "./header-filters";
import { PropertyImage } from "./property-image";
import { PropertyStatus } from "./property-status";
import { PublishedStatus } from "./published-status";
import { RelativeTimeCell } from "./relative-time-cell";
import { PropertyRow } from "./types";

interface CreateColumnsProps {
  dictionaries: DBDictionary[];
  entries: DBDictionaryEntry[];
  locale: string;
}

export const createPropertyColumns = ({
  dictionaries,
  entries,
  locale,
}: CreateColumnsProps): ColumnDef<PropertyRow>[] => [
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
    header: ({ column }) => (
      <div className="flex flex-col gap-1">
        <span>Property Type</span>
        <DictionaryHeaderFilter
          column={column}
          dictionaryCode={PropertyFieldToDictionaryCodeMap.property_type}
          dictionaries={dictionaries}
          entries={entries}
          locale={locale}
        />
      </div>
    ),
    cell: ({ row }) => {
      const type = row.getValue<string>("property_type");
      return type || <span className="text-muted-foreground">—</span>;
    },
    filterFn: (row, columnId, filterValue) => {
      const propertyTypeId = row.original.property_type_id;
      return filterValue === undefined || propertyTypeId?.toString() === filterValue;
    },
    meta: { filterVariant: "select" },
  },
  {
    accessorKey: "area",
    header: ({ column }) => (
      <div className="flex flex-col gap-1">
        <span>Area</span>
        <DictionaryHeaderFilter
          column={column}
          dictionaryCode={PropertyFieldToDictionaryCodeMap.area}
          dictionaries={dictionaries}
          entries={entries}
          locale={locale}
        />
      </div>
    ),
    cell: ({ row }) => {
      const area = row.getValue<string>("area");
      return area || <span className="text-muted-foreground">—</span>;
    },
    filterFn: (row, columnId, filterValue) => {
      const areaId = row.original.area_id;
      return filterValue === undefined || areaId?.toString() === filterValue;
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
    header: ({ column }) => (
      <div className="flex flex-col gap-1">
        <span>For Rent</span>
        <BooleanHeaderFilter column={column} />
      </div>
    ),
    cell: ({ row }) => (row.original.rent_enabled ? "Yes" : "No"),
    enableSorting: false,
    filterFn: (row, columnId, filterValue) => {
      const rentEnabled = row.original.rent_enabled;
      return filterValue === undefined || rentEnabled === filterValue;
    },
    meta: { filterVariant: "select" },
  },
  {
    accessorKey: "sale_enabled",
    header: ({ column }) => (
      <div className="flex flex-col gap-1">
        <span>For Sale</span>
        <BooleanHeaderFilter column={column} />
      </div>
    ),
    cell: ({ row }) => (row.original.sale_enabled ? "Yes" : "No"),
    enableSorting: false,
    filterFn: (row, columnId, filterValue) => {
      const saleEnabled = row.original.sale_enabled;
      return filterValue === undefined || saleEnabled === filterValue;
    },
    meta: { filterVariant: "select" },
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
    header: ({ column }) => (
      <div className="flex flex-col gap-1">
        <span>Published</span>
        <BooleanHeaderFilter column={column} />
      </div>
    ),
    cell: ({ row }) => <PublishedStatus is_published={row.getValue("is_published")} />,
    filterFn: (row, columnId, filterValue) => {
      const isPublished = row.original.is_published;
      return filterValue === undefined || isPublished === filterValue;
    },
    meta: { filterVariant: "select" },
  },
  {
    accessorKey: "updated_at",
    header: "Updated",
    cell: ({ row }) => <RelativeTimeCell date={row.getValue("updated_at")} />,
  },
];
