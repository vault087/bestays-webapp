import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ArrowDownNarrowWide, ArrowUpNarrowWide } from "lucide-react";
import { DBDictionary, DBDictionaryEntry } from "@/entities/dictionaries";
import { PropertyFieldToDictionaryCodeMap } from "@/entities/properties-sale-rent/types/property-fields.types";
import { capitalize } from "@/utils/capitalize";
import { BooleanHeaderFilter, DictionaryHeaderFilter, HeaderDropdown } from "./header-filters";
import { PropertyImage } from "./property-image";
import { PublishedStatus } from "./published-status";
import { RelativeTimeCell } from "./relative-time-cell";
import { PropertyRow } from "./types";

// Price Badge Component
interface PriceBadgeProps {
  price: number | null;
  enabled: boolean | null;
  type: "rent" | "sale";
}

function PriceBadge({ price, enabled, type }: PriceBadgeProps) {
  if (!enabled) {
    return (
      <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset">
        Not set
      </span>
    );
  }

  if (!price) {
    return (
      <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-yellow-600/20 ring-inset">
        Price TBD
      </span>
    );
  }

  const bgColor = type === "rent" ? "bg-blue-50" : "bg-green-50";
  const textColor = type === "rent" ? "text-blue-700" : "text-green-700";
  const ringColor = type === "rent" ? "ring-blue-700/10" : "ring-green-700/10";

  return (
    <span
      className={`inline-flex items-center rounded-md ${bgColor} px-2 py-1 text-xs font-medium ${textColor} ring-1 ring-inset ${ringColor}`}
    >
      ₿{price.toLocaleString()}
    </span>
  );
}

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
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      const SortIcon =
        sortDirection === "desc" ? ArrowDownNarrowWide : sortDirection === "asc" ? ArrowUpNarrowWide : ArrowUpDown;

      return (
        <div className="flex h-12 items-center justify-between">
          <span className="text-sm font-medium tracking-wide">ID</span>
          <button
            className="hover:bg-muted/30 ml-2 rounded p-1 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              column.toggleSorting();
            }}
          >
            <SortIcon className="h-4 w-4 opacity-60 transition-opacity hover:opacity-100" />
          </button>
        </div>
      );
    },
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-xs">{row.getValue<string>("id").slice(0, 8)}</span>
    ),
  },
  {
    accessorKey: "personal_title",
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      const SortIcon =
        sortDirection === "desc" ? ArrowDownNarrowWide : sortDirection === "asc" ? ArrowUpNarrowWide : ArrowUpDown;

      return (
        <div className="flex h-12 items-center justify-between">
          <span className="text-sm font-medium tracking-wide">{capitalize("title")}</span>
          <button
            className="hover:bg-muted/30 ml-2 rounded p-1 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              column.toggleSorting();
            }}
          >
            <SortIcon className="h-4 w-4 opacity-60 transition-opacity hover:opacity-100" />
          </button>
        </div>
      );
    },
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
    header: ({ column }) => {
      const hasFilter = column.getFilterValue() !== undefined;

      return (
        <HeaderDropdown title={capitalize("property type")} hasFilter={hasFilter}>
          <DictionaryHeaderFilter
            title={capitalize("property type")}
            column={column}
            dictionaryCode={PropertyFieldToDictionaryCodeMap.property_type}
            dictionaries={dictionaries}
            entries={entries}
            locale={locale}
          />
        </HeaderDropdown>
      );
    },
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
    header: ({ column }) => {
      const hasFilter = column.getFilterValue() !== undefined;

      return (
        <HeaderDropdown title={capitalize("area")} hasFilter={hasFilter}>
          <DictionaryHeaderFilter
            column={column}
            dictionaryCode={PropertyFieldToDictionaryCodeMap.area}
            dictionaries={dictionaries}
            entries={entries}
            locale={locale}
            title={capitalize("area")}
          />
        </HeaderDropdown>
      );
    },
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
    accessorKey: "rent_enabled",
    header: ({ column }) => {
      const hasFilter = column.getFilterValue() !== undefined;

      return (
        <HeaderDropdown title={capitalize("rent")} hasFilter={hasFilter}>
          <BooleanHeaderFilter column={column} title={capitalize("rent")} />
        </HeaderDropdown>
      );
    },
    cell: ({ row }) => <PriceBadge price={row.original.rent_price} enabled={row.original.rent_enabled} type="rent" />,
    filterFn: (row, columnId, filterValue) => {
      const rentEnabled = row.original.rent_enabled;
      return filterValue === undefined || rentEnabled === filterValue;
    },
    meta: { filterVariant: "select" },
  },
  {
    accessorKey: "sale_enabled",
    header: ({ column }) => {
      const hasFilter = column.getFilterValue() !== undefined;

      return (
        <HeaderDropdown title={capitalize("sale")} hasFilter={hasFilter}>
          <BooleanHeaderFilter column={column} title={capitalize("sale")} />
        </HeaderDropdown>
      );
    },
    cell: ({ row }) => <PriceBadge price={row.original.sale_price} enabled={row.original.sale_enabled} type="sale" />,
    filterFn: (row, columnId, filterValue) => {
      const saleEnabled = row.original.sale_enabled;
      return filterValue === undefined || saleEnabled === filterValue;
    },
    meta: { filterVariant: "select" },
  },
  {
    accessorKey: "is_published",
    header: ({ column }) => {
      const hasFilter = column.getFilterValue() !== undefined;

      return (
        <HeaderDropdown title={capitalize("published")} hasFilter={hasFilter}>
          <BooleanHeaderFilter column={column} title={capitalize("published")} />
        </HeaderDropdown>
      );
    },
    cell: ({ row }) => <PublishedStatus is_published={row.getValue("is_published")} />,
    filterFn: (row, columnId, filterValue) => {
      const isPublished = row.original.is_published;
      return filterValue === undefined || isPublished === filterValue;
    },
    meta: { filterVariant: "select" },
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      const SortIcon =
        sortDirection === "desc" ? ArrowDownNarrowWide : sortDirection === "asc" ? ArrowUpNarrowWide : ArrowUpDown;

      return (
        <div className="flex h-12 items-center justify-between">
          <span className="text-sm font-medium tracking-wide">{capitalize("updated")}</span>
          <button
            className="hover:bg-muted/30 ml-2 rounded p-1 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              column.toggleSorting();
            }}
          >
            <SortIcon className="h-4 w-4 opacity-60 transition-opacity hover:opacity-100" />
          </button>
        </div>
      );
    },
    cell: ({ row }) => <RelativeTimeCell date={row.getValue("updated_at")} />,
  },
];
