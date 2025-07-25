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
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/modules/shadcn/components/ui/table";
import { createPropertyColumns } from "./property-listing-columns";
import { PropertyRow } from "./types";

interface PropertyListingTableProps {
  data: PropertyRow[];
  columnFilters: ColumnFiltersState;
  setColumnFilters: (filters: ColumnFiltersState | ((prev: ColumnFiltersState) => ColumnFiltersState)) => void;
  sorting: SortingState;
  setSorting: (sorting: SortingState | ((prev: SortingState) => SortingState)) => void;
}

export function PropertyListingTable({
  data,
  columnFilters,
  setColumnFilters,
  sorting,
  setSorting,
}: PropertyListingTableProps) {
  const router = useRouter();
  const columns = createPropertyColumns();

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
                  className="h-10 select-none"
                  aria-sort={
                    header.column.getIsSorted() === "asc"
                      ? "ascending"
                      : header.column.getIsSorted() === "desc"
                        ? "descending"
                        : "none"
                  }
                >
                  {header.isPlaceholder ? null : header.column.getCanSort() ? (
                    <div
                      className="flex h-full cursor-pointer items-center justify-between gap-2 select-none"
                      onClick={header.column.getToggleSortingHandler()}
                      onKeyDown={(e) => {
                        if (header.column.getCanSort() && (e.key === "Enter" || e.key === " ")) {
                          e.preventDefault();
                          header.column.getToggleSortingHandler()?.(e);
                        }
                      }}
                      tabIndex={header.column.getCanSort() ? 0 : undefined}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <ChevronUpIcon className="shrink-0 opacity-60" size={16} aria-hidden="true" />,
                        desc: <ChevronDownIcon className="shrink-0 opacity-60" size={16} aria-hidden="true" />,
                      }[header.column.getIsSorted() as string] ?? <span className="size-4" aria-hidden="true" />}
                    </div>
                  ) : (
                    flexRender(header.column.columnDef.header, header.getContext())
                  )}
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
