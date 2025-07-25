"use client";

import { ColumnFiltersState } from "@tanstack/react-table";
import { X } from "lucide-react";
import { memo, useCallback } from "react";
import { DBDictionaryEntry } from "@/entities/dictionaries";
import { getAvailableLocalizedText } from "@/entities/localized-text/utils/get-available-localized-text";
import { Button } from "@/modules/shadcn";
import { cn } from "@/modules/shadcn/utils/cn";
import { capitalize } from "@/utils/capitalize";
import {
  TABLE_FIELDS_CONFIG,
  VISIBLE_FIELDS,
  GRID_TEMPLATE_COLUMNS,
  type TableFieldKey,
} from "@/entities/properties-sale-rent/features/listing/types/table-fields.types";

interface CustomFilterRowProps {
  columnFilters: ColumnFiltersState;
  setColumnFilters: (filters: ColumnFiltersState | ((prev: ColumnFiltersState) => ColumnFiltersState)) => void;
  entries: DBDictionaryEntry[];
  locale: string;
}

export const CustomFilterRow = memo(function CustomFilterRow({
  columnFilters,
  setColumnFilters,
  entries,
  locale,
}: CustomFilterRowProps) {
  const removeFilter = useCallback(
    (columnId: string) => {
      setColumnFilters((prev) => prev.filter((filter) => filter.id !== columnId));
    },
    [setColumnFilters]
  );

  const getFilterDisplayValue = useCallback(
    (filter: { id: string; value: string | boolean | number }): string => {
      // Handle boolean filters
      if (typeof filter.value === "boolean") {
        return filter.value ? "Yes" : "No";
      }

      // Handle dictionary filters
      if (typeof filter.value === "string" && filter.value !== "all") {
        const entry = entries.find((e) => e.id.toString() === filter.value);
        if (entry) {
          return capitalize(getAvailableLocalizedText(entry.name, locale));
        }
      }

      return filter.value?.toString() || "";
    },
    [entries, locale]
  );

  const renderFilterCell = useCallback(
    (fieldKey: TableFieldKey) => {
      const config = TABLE_FIELDS_CONFIG[fieldKey];
      const filter = columnFilters.find((f) => f.id === fieldKey);

      // If no filter for this field, render empty cell
      if (!filter) {
        return (
          <div
            key={`filter-${fieldKey}`}
            className={cn(config.cellClassName, "py-2")}
          >
            {/* Empty cell for no filter */}
          </div>
        );
      }

      const displayValue = getFilterDisplayValue(filter);
      
      // If no display value, render empty cell
      if (!displayValue) {
        return (
          <div
            key={`filter-${fieldKey}`}
            className={cn(config.cellClassName, "py-2")}
          >
            {/* Empty cell for invalid filter */}
          </div>
        );
      }

      // Render filter badge in the proper column
      return (
        <div
          key={`filter-${fieldKey}`}
          className={cn(config.cellClassName, "py-2")}
        >
          <div
            className={cn(
              "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium",
              "bg-gray-100 text-gray-800 border border-gray-200",
              "max-w-full"
            )}
          >
            <span className="truncate">{displayValue}</span>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-gray-200 h-4 w-4 p-0 ml-1 flex-shrink-0"
              onClick={() => removeFilter(filter.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      );
    },
    [columnFilters, getFilterDisplayValue, removeFilter]
  );

  // Only render filter row if there are active filters
  if (columnFilters.length === 0) return null;

  return (
    <div
      className="border-b border-gray-100 bg-gray-50/50 min-h-[48px] flex items-center"
      style={{
        display: "grid",
        gridTemplateColumns: GRID_TEMPLATE_COLUMNS,
      }}
    >
      {VISIBLE_FIELDS.map(renderFilterCell)}
    </div>
  );
});

// Alternative implementation with explicit filter positioning
export const CustomFilterRowExplicit = memo(function CustomFilterRowExplicit({
  columnFilters,
  setColumnFilters,
  entries,
  locale,
}: CustomFilterRowProps) {
  const removeFilter = useCallback(
    (columnId: string) => {
      setColumnFilters((prev) => prev.filter((filter) => filter.id !== columnId));
    },
    [setColumnFilters]
  );

  const getFilterDisplayValue = useCallback(
    (filter: { id: string; value: string | boolean | number }): string => {
      // Handle boolean filters
      if (typeof filter.value === "boolean") {
        return filter.value ? "Yes" : "No";
      }

      // Handle dictionary filters
      if (typeof filter.value === "string" && filter.value !== "all") {
        const entry = entries.find((e) => e.id.toString() === filter.value);
        if (entry) {
          return capitalize(getAvailableLocalizedText(entry.name, locale));
        }
      }

      return filter.value?.toString() || "";
    },
    [entries, locale]
  );

  if (columnFilters.length === 0) return null;

  return (
    <div className="border-b border-gray-100 bg-gray-50/50 px-4 py-2">
      <div className="flex flex-wrap gap-2">
        {columnFilters.map((filter) => {
          const displayValue = getFilterDisplayValue(filter);
          if (!displayValue) return null;

          return (
            <div
              key={filter.id}
              className={cn(
                "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium",
                "bg-gray-100 text-gray-800 border border-gray-200"
              )}
            >
              <span>{displayValue}</span>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-gray-200 h-4 w-4 p-0 ml-1"
                onClick={() => removeFilter(filter.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}); 