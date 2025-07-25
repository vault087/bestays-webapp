"use client";

import { useCallback, useMemo, useState } from "react";
import { SortingState } from "@tanstack/react-table";
import { TableFieldKey } from "../types/table-fields.types";

/**
 * Hook for managing table sorting state and operations
 * Follows project pattern of clear return interface and useCallback optimization
 */
export function useTableSorting(initialSort?: SortingState) {
  const [sorting, setSorting] = useState<SortingState>(
    initialSort || [{ id: "updated_at", desc: true }]
  );

  // Get current sort direction for a specific field
  const getSortDirection = useCallback(
    (fieldKey: TableFieldKey): "asc" | "desc" | null => {
      const sortItem = sorting.find((item) => item.id === fieldKey);
      if (!sortItem) return null;
      return sortItem.desc ? "desc" : "asc";
    },
    [sorting]
  );

  // Toggle sort for a specific field
  const toggleSort = useCallback(
    (fieldKey: TableFieldKey) => {
      setSorting((prevSorting) => {
        const existingSort = prevSorting.find((item) => item.id === fieldKey);

        if (!existingSort) {
          // No current sort - set to ascending
          return [{ id: fieldKey, desc: false }];
        }

        if (!existingSort.desc) {
          // Currently ascending - change to descending
          return [{ id: fieldKey, desc: true }];
        }

        // Currently descending - remove sort (or set to ascending based on requirements)
        return [];
      });
    },
    []
  );

  // Clear all sorting
  const clearSort = useCallback(() => {
    setSorting([]);
  }, []);

  // Set specific sort
  const setSort = useCallback((fieldKey: TableFieldKey, direction: "asc" | "desc") => {
    setSorting([{ id: fieldKey, desc: direction === "desc" }]);
  }, []);

  // Apply sorting to data array
  const applySorting = useCallback(
    <T extends Record<string, unknown>>(data: T[]): T[] => {
      if (sorting.length === 0) return data;

      return [...data].sort((a, b) => {
        for (const sortItem of sorting) {
          const aValue = a[sortItem.id];
          const bValue = b[sortItem.id];

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
    },
    [sorting]
  );

  const sortedFields = useMemo(() => {
    return sorting.map((item) => ({
      field: item.id as TableFieldKey,
      direction: item.desc ? "desc" as const : "asc" as const,
    }));
  }, [sorting]);

  return {
    sorting,
    setSorting,
    getSortDirection,
    toggleSort,
    clearSort,
    setSort,
    applySorting,
    sortedFields,
    hasSort: sorting.length > 0,
  };
} 