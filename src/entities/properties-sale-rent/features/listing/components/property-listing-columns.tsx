import { ColumnDef } from "@tanstack/react-table";
import { DBDictionary, DBDictionaryEntry } from "@/entities/dictionaries";
import { PropertyFieldToDictionaryCodeMap } from "@/entities/properties-sale-rent/types/property-fields.types";
import { capitalize } from "@/utils/capitalize";
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
    header: () => (
      <div className="flex h-16 flex-col justify-start">
        <span className="text-sm font-medium tracking-wide">{capitalize("title")}</span>
      </div>
    ),
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
      <div className="flex h-16 flex-col justify-start">
        <span className="mb-1 text-sm font-medium tracking-wide">{capitalize("property type")}</span>
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
      <div className="flex h-16 flex-col justify-start">
        <span className="mb-1 text-sm font-medium tracking-wide">{capitalize("area")}</span>
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
    header: () => (
      <div className="flex h-16 flex-col justify-start">
        <span className="text-sm font-medium tracking-wide">{capitalize("rent price")}</span>
      </div>
    ),
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
    header: () => (
      <div className="flex h-16 flex-col justify-start">
        <span className="text-sm font-medium tracking-wide">{capitalize("sale price")}</span>
      </div>
    ),
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
      <div className="flex h-16 flex-col justify-start">
        <span className="mb-1 text-sm font-medium tracking-wide">{capitalize("for rent")}</span>
        <BooleanHeaderFilter column={column} />
      </div>
    ),
    cell: ({ row }) => (row.original.rent_enabled ? capitalize("yes") : capitalize("no")),
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
      <div className="flex h-16 flex-col justify-start">
        <span className="mb-1 text-sm font-medium tracking-wide">{capitalize("for sale")}</span>
        <BooleanHeaderFilter column={column} />
      </div>
    ),
    cell: ({ row }) => (row.original.sale_enabled ? capitalize("yes") : capitalize("no")),
    enableSorting: false,
    filterFn: (row, columnId, filterValue) => {
      const saleEnabled = row.original.sale_enabled;
      return filterValue === undefined || saleEnabled === filterValue;
    },
    meta: { filterVariant: "select" },
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="flex h-16 flex-col justify-start">
        <span className="text-sm font-medium tracking-wide">{capitalize("status")}</span>
      </div>
    ),
    cell: ({ row }) => (
      <PropertyStatus rent_enabled={row.original.rent_enabled} sale_enabled={row.original.sale_enabled} />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "is_published",
    header: ({ column }) => (
      <div className="flex h-16 flex-col justify-start">
        <span className="mb-1 text-sm font-medium tracking-wide">{capitalize("published")}</span>
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
    header: () => (
      <div className="flex h-16 flex-col justify-start">
        <span className="text-sm font-medium tracking-wide">{capitalize("updated")}</span>
      </div>
    ),
    cell: ({ row }) => <RelativeTimeCell date={row.getValue("updated_at")} />,
  },
];
