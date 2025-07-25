"use client";

import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { memo, useMemo } from "react";
import { DBDictionary, DBDictionaryEntry } from "@/entities/dictionaries";
import { DashboardProperty } from "@/entities/properties-sale-rent/libs/load-properties";
import { CustomFilterRow } from "./custom-filter-row";
import { CustomTableHeader } from "./custom-table-header";
import { CustomTableRow } from "./custom-table-row";
import { PropertyRow } from "./types";

interface CustomPropertyTableProps {
  data: PropertyRow[];
  dictionaries: DBDictionary[];
  entries: DBDictionaryEntry[];
  locale: string;
  columnFilters: ColumnFiltersState;
  setColumnFilters: (filters: ColumnFiltersState | ((prev: ColumnFiltersState) => ColumnFiltersState)) => void;
  sorting: SortingState;
  setSorting: (sorting: SortingState | ((prev: SortingState) => SortingState)) => void;
  onRowClick?: (propertyId: string) => void;
}

export const CustomPropertyTable = memo(function CustomPropertyTable({
  data,
  dictionaries,
  entries,
  locale,
  columnFilters,
  setColumnFilters,
  sorting,
  setSorting,
  onRowClick,
}: CustomPropertyTableProps) {
  // Convert PropertyRow to DashboardProperty for internal use
  const dashboardData: DashboardProperty[] = useMemo(() => {
    return data.map((row) => ({
      id: row.id,
      personal_title: row.personal_title,
      property_type: row.property_type,
      area: row.area,
      rent_price: row.rent_price,
      sale_price: row.sale_price,
      rent_enabled: row.rent_enabled,
      sale_enabled: row.sale_enabled,
      cover_image: row.cover_image,
      is_published: row.is_published,
      updated_at: row.updated_at,
      deleted_at: null, // Not used in listing
    }));
  }, [data]);

  // Apply filtering to data using original TanStack logic
  const filteredData = useMemo(() => {
    if (columnFilters.length === 0) return dashboardData;

    return dashboardData.filter((item) => {
      return columnFilters.every((filter) => {
        const { id: fieldKey, value: filterValue } = filter;

        // Handle boolean filters (same as original filterFn)
        if (typeof filterValue === "boolean") {
          const row = data.find((r) => r.id === item.id);
          if (!row) return false;

          switch (fieldKey) {
            case "rent_enabled":
              return row.rent_enabled === filterValue;
            case "sale_enabled":
              return row.sale_enabled === filterValue;
            case "is_published":
              return row.is_published === filterValue;
            default:
              return item[fieldKey as keyof DashboardProperty] === filterValue;
          }
        }

        // Handle dictionary filters using original ID fields (same as original filterFn)
        if (typeof filterValue === "string" && filterValue !== "all") {
          const row = data.find((r) => r.id === item.id);
          if (!row) return false;

          switch (fieldKey) {
            case "property_type":
              return row.property_type_id?.toString() === filterValue;
            case "area":
              return row.area_id?.toString() === filterValue;
            default:
              return true;
          }
        }

        // filterValue is undefined or "all" - show all items
        return true;
      });
    });
  }, [dashboardData, columnFilters, data]);

  // Apply sorting to filtered data
  const sortedData = useMemo(() => {
    if (sorting.length === 0) return filteredData;

    return [...filteredData].sort((a, b) => {
      for (const sortItem of sorting) {
        const aValue = a[sortItem.id as keyof DashboardProperty];
        const bValue = b[sortItem.id as keyof DashboardProperty];

        // Handle null/undefined values
        if (aValue == null && bValue == null) continue;
        if (aValue == null) return sortItem.desc ? 1 : -1;
        if (bValue == null) return sortItem.desc ? -1 : 1;

        // Compare values
        let comparison = 0;
        if (typeof aValue === "string" && typeof bValue === "string") {
          comparison = aValue.localeCompare(bValue);
        } else if (typeof aValue === "number" && typeof bValue === "number") {
          comparison = aValue - bValue;
        } else if (aValue instanceof Date && bValue instanceof Date) {
          comparison = aValue.getTime() - bValue.getTime();
        } else {
          comparison = String(aValue).localeCompare(String(bValue));
        }

        if (comparison !== 0) {
          return sortItem.desc ? -comparison : comparison;
        }
      }
      return 0;
    });
  }, [filteredData, sorting]);

  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Filter Row */}

      {/* Header */}
      <CustomTableHeader
        sorting={sorting}
        setSorting={setSorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        dictionaries={dictionaries}
        entries={entries}
        locale={locale}
      />

      {/* Table Body */}
      <div className="divide-y divide-gray-100">
        {sortedData.length > 0 ? (
          sortedData.map((row, index) => (
            <CustomTableRow
              key={row.id}
              row={row}
              entries={entries}
              locale={locale}
              onClick={onRowClick}
              isLast={index === sortedData.length - 1}
            />
          ))
        ) : (
          <div className="px-4 py-12 text-center text-gray-500">
            <div className="text-sm">No properties found.</div>
            {columnFilters.length > 0 && <div className="mt-1 text-xs">Try adjusting your filters</div>}
          </div>
        )}
      </div>
    </div>
  );
});

// Type-safe wrapper for the main table component
interface TypeSafeCustomPropertyTableProps {
  data: DashboardProperty[];
  dictionaries: DBDictionary[];
  entries: DBDictionaryEntry[];
  locale: string;
  columnFilters: ColumnFiltersState;
  setColumnFilters: (filters: ColumnFiltersState | ((prev: ColumnFiltersState) => ColumnFiltersState)) => void;
  sorting: SortingState;
  setSorting: (sorting: SortingState | ((prev: SortingState) => SortingState)) => void;
  onRowClick?: (propertyId: string) => void;
}

export const TypeSafeCustomPropertyTable = memo(function TypeSafeCustomPropertyTable({
  data,
  dictionaries,
  entries,
  locale,
  columnFilters,
  setColumnFilters,
  sorting,
  setSorting,
  onRowClick,
}: TypeSafeCustomPropertyTableProps) {
  // Convert DashboardProperty to PropertyRow format
  const propertyRows: PropertyRow[] = useMemo(() => {
    return data.map((property) => ({
      id: property.id,
      personal_title: property.personal_title,
      property_type: property.property_type,
      area: property.area,
      rent_price: property.rent_price,
      sale_price: property.sale_price,
      rent_enabled: property.rent_enabled,
      sale_enabled: property.sale_enabled,
      cover_image: property.cover_image,
      is_published: property.is_published,
      updated_at: property.updated_at,
      // These fields would need to be populated from the original data if filtering is needed
      property_type_id: null,
      area_id: null,
    }));
  }, [data]);

  return (
    <CustomPropertyTable
      data={propertyRows}
      dictionaries={dictionaries}
      entries={entries}
      locale={locale}
      columnFilters={columnFilters}
      setColumnFilters={setColumnFilters}
      sorting={sorting}
      setSorting={setSorting}
      onRowClick={onRowClick}
    />
  );
});
