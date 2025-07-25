"use client";

import { useCallback, useMemo } from "react";
import { ColumnFiltersState } from "@tanstack/react-table";
import { DBDictionaryEntry } from "@/entities/dictionaries";
import { getAvailableLocalizedText } from "@/entities/localized-text/utils/get-available-localized-text";
import { FilterableFieldKey } from "../types/table-fields.types";

/**
 * Hook for managing table filtering operations
 * Follows project pattern of clear state management and optimization
 */
export function useTableFiltering(
  columnFilters: ColumnFiltersState,
  setColumnFilters: (filters: ColumnFiltersState | ((prev: ColumnFiltersState) => ColumnFiltersState)) => void,
  entries: DBDictionaryEntry[],
  locale: string
) {
  // Get filter value for a specific field
  const getFilterValue = useCallback(
    (fieldKey: FilterableFieldKey): string | boolean | undefined => {
      const filter = columnFilters.find((f) => f.id === fieldKey);
      return filter?.value as string | boolean | undefined;
    },
    [columnFilters]
  );

  // Set filter value for a specific field
  const setFilterValue = useCallback(
    (fieldKey: FilterableFieldKey, value: string | boolean | undefined) => {
      setColumnFilters((prev) => {
        if (value === undefined || value === "") {
          return prev.filter((f) => f.id !== fieldKey);
        }

        const existingIndex = prev.findIndex((f) => f.id === fieldKey);
        if (existingIndex >= 0) {
          // Update existing filter
          const newFilters = [...prev];
          newFilters[existingIndex] = { id: fieldKey, value };
          return newFilters;
        } else {
          // Add new filter
          return [...prev, { id: fieldKey, value }];
        }
      });
    },
    [setColumnFilters]
  );

  // Remove filter for a specific field
  const removeFilter = useCallback(
    (fieldKey: FilterableFieldKey) => {
      setColumnFilters((prev) => prev.filter((f) => f.id !== fieldKey));
    },
    [setColumnFilters]
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setColumnFilters([]);
  }, [setColumnFilters]);

  // Get display value for filter (for badges)
  const getFilterDisplayValue = useCallback(
    (filter: { id: string; value: string | boolean | number }): string => {
      // Handle boolean filters
      if (typeof filter.value === "boolean") {
        return filter.value ? "Yes" : "No";
      }

      // Handle dictionary filters (area, property_type)
      if (typeof filter.value === "string" && filter.value !== "all") {
        const entry = entries.find((e) => e.id.toString() === filter.value);
        if (entry) {
          return getAvailableLocalizedText(entry.name, locale);
        }
      }

      return filter.value?.toString() || "";
    },
    [entries, locale]
  );

  // Apply filtering to data array
  const applyFiltering = useCallback(
    <T extends Record<string, unknown>>(
      data: T[],
      filterMappings?: Record<string, (item: T, filterValue: unknown) => boolean>
    ): T[] => {
      if (columnFilters.length === 0) return data;

      return data.filter((item) => {
        return columnFilters.every((filter) => {
          const { id: fieldKey, value: filterValue } = filter;

          // Use custom filter mapping if provided
          if (filterMappings && filterMappings[fieldKey]) {
            return filterMappings[fieldKey](item, filterValue);
          }

          // Default filtering logic
          const itemValue = item[fieldKey];

          // Handle boolean filters
          if (typeof filterValue === "boolean") {
            return itemValue === filterValue;
          }

          // Handle string filters (dictionary entries)
          if (typeof filterValue === "string") {
            // For dictionary fields, we need to check against the original ID
            const originalIdField = `${fieldKey}_id` as keyof T;
            const originalId = item[originalIdField];
            return originalId?.toString() === filterValue;
          }

          return true;
        });
      });
    },
    [columnFilters]
  );

  // Get active filters summary
  const activeFilters = useMemo(() => {
    return columnFilters.map((filter) => ({
      field: filter.id as FilterableFieldKey,
      value: filter.value,
      displayValue: getFilterDisplayValue(filter),
    }));
  }, [columnFilters, getFilterDisplayValue]);

  return {
    getFilterValue,
    setFilterValue,
    removeFilter,
    clearAllFilters,
    getFilterDisplayValue,
    applyFiltering,
    activeFilters,
    hasFilters: columnFilters.length > 0,
  };
} 