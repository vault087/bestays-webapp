"use client";

import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { memo, useMemo } from "react";
import { DBDictionaryEntry } from "@/entities/dictionaries";
import { TABLE_FIELDS_CONFIG } from "@/entities/properties-sale-rent/features/listing/types/table-fields.types";
import { useTableSorting, useTableFiltering } from "@/entities/properties-sale-rent/features/listing/hooks";
import { useRouter } from "@/modules/i18n/core/client/navigation";
import { CustomFilterRow } from "./custom-filter-row"; 
import { CustomTableHeader } from "./custom-table-header";
import { CustomTableRow } from "./custom-table-row";
import { PropertyRow } from "./types";

interface CustomPropertyTableProps {
  data: PropertyRow[];
  entries: DBDictionaryEntry[];
  locale: string;
  columnFilters: ColumnFiltersState;
  setColumnFilters: (filters: ColumnFiltersState | ((prev: ColumnFiltersState) => ColumnFiltersState)) => void;
  sorting: SortingState;
  setSorting: (sorting: SortingState | ((prev: SortingState) => SortingState)) => void;
}

/**
 * Complete custom property table implementation
 * Uses CSS Grid for perfect alignment and custom hooks for state management
 */
export const CustomPropertyTable = memo(function CustomPropertyTable({
  data,
  entries,
  locale,
  columnFilters,
  setColumnFilters,
  sorting,
  setSorting,
}: CustomPropertyTableProps) {
  const router = useRouter();

  // Use custom hooks for table functionality
  const {
    getSortDirection,
    toggleSort,
    applySorting,
  } = useTableSorting(sorting);

  const {
    getFilterDisplayValue,
    removeFilter,
  } = useTableFiltering(columnFilters, setColumnFilters, entries, locale);

  // Apply sorting and filtering to data
  const processedData = useMemo(() => {
    let result = [...data];
    
    // Apply sorting
    result = applySorting(result);
    
    return result;
  }, [data, applySorting]);

  // Handle row click navigation
  const handleRowClick = (propertyId: string): void => {
    router.push(`/dashboard/properties/${propertyId}`);
  };

  // Handle sort changes
  const handleSort = (fieldKey: string): void => {
    toggleSort(fieldKey);
    // Update external sorting state
    setSorting((prev) => {
      const existingSort = prev.find((item) => item.id === fieldKey);
      if (!existingSort) {
        return [{ id: fieldKey, desc: false }];
      }
      if (!existingSort.desc) {
        return [{ id: fieldKey, desc: true }];
      }
      return [];
    });
  };

  // Handle filter opening
  const handleFilterOpen = (fieldKey: string): void => {
    // Here you would implement filter dialog logic
    console.log("Open filter for:", fieldKey);
  };

  // Handle filter removal
  const handleFilterRemove = (fieldKey: string): void => {
    removeFilter(fieldKey);
  };

  return (
    <div className="rounded-md border">
      {/* Header row with sorting icons and filter dropdowns */}
      <CustomTableHeader
        fields={TABLE_FIELDS_CONFIG}
        getSortDirection={getSortDirection}
        onSort={handleSort}
        onFilterOpen={handleFilterOpen}
      />

      {/* Filter badges row - perfectly aligned under headers */}
      <CustomFilterRow
        fields={TABLE_FIELDS_CONFIG}
        columnFilters={columnFilters}
        getFilterDisplayValue={getFilterDisplayValue}
        onRemoveFilter={handleFilterRemove}
      />

      {/* Table body with data rows */}
      <div className="min-h-[400px]">
        {processedData.length > 0 ? (
          processedData.map((row) => (
            <CustomTableRow
              key={row.id}
              fields={TABLE_FIELDS_CONFIG}
              data={row}
              onClick={handleRowClick}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-24 text-center text-muted-foreground">
            No properties found.
          </div>
        )}
      </div>
    </div>
  );
}); 