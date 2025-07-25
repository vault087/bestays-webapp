"use client";

import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  Updater,
} from "@tanstack/react-table";
import { DBDictionary, DBDictionaryEntry } from "@/entities/dictionaries";
import { useRouter } from "@/modules/i18n/core/client/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/modules/shadcn/components/ui/table";
import { createPropertyColumns } from "./property-listing-columns";
import { PropertyRow } from "./types";

interface PropertyListingTableProps {
  data: PropertyRow[];
  dictionaries: DBDictionary[];
  entries: DBDictionaryEntry[];
  locale: string;
  columnFilters: ColumnFiltersState;
  setColumnFilters: (filters: ColumnFiltersState | ((prev: ColumnFiltersState) => ColumnFiltersState)) => void;
  sorting: SortingState;
  setSorting: (sorting: SortingState | ((prev: SortingState) => SortingState)) => void;
}

export function PropertyListingTable({
  data,
  dictionaries,
  entries,
  locale,
  columnFilters,
  setColumnFilters,
  sorting,
  setSorting,
}: PropertyListingTableProps) {
  const router = useRouter();
  const columns = createPropertyColumns({ dictionaries, entries, locale });

  const handleColumnFiltersChange = (updaterOrValue: Updater<ColumnFiltersState>) => {
    if (typeof updaterOrValue === "function") {
      setColumnFilters(updaterOrValue);
    } else {
      setColumnFilters(updaterOrValue);
    }
  };

  const handleSortingChange = (updaterOrValue: Updater<SortingState>) => {
    if (typeof updaterOrValue === "function") {
      setSorting(updaterOrValue);
    } else {
      setSorting(updaterOrValue);
    }
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onColumnFiltersChange: handleColumnFiltersChange,
    onSortingChange: handleSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: false,
  });

  const handleRowClick = (propertyId: string) => {
    router.push(`/dashboard/properties/${propertyId}`);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-muted/50">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="relative h-12 px-4 py-2 align-top select-none"
                  style={{
                    // Reserve space for filter dropdowns (40px height + padding)
                    paddingBottom: "48px",
                  }}
                  aria-sort={
                    header.column.getIsSorted() === "asc"
                      ? "ascending"
                      : header.column.getIsSorted() === "desc"
                        ? "descending"
                        : "none"
                  }
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleRowClick(row.original.id)}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No properties found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
