"use client";

import { ColumnFiltersState } from "@tanstack/react-table";
import { X } from "lucide-react";
import { memo, useCallback } from "react";
import { DBDictionaryEntry } from "@/entities/dictionaries";
import { getAvailableLocalizedText } from "@/entities/localized-text/utils/get-available-localized-text";
import {
  TABLE_FIELDS_CONFIG,
  VISIBLE_FIELDS,
  GRID_TEMPLATE_COLUMNS,
  type TableFieldKey,
} from "@/entities/properties-sale-rent/features/listing/types/table-fields.types";
import { Badge } from "@/modules/shadcn";
import { capitalize } from "@/utils/capitalize";

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
    [setColumnFilters],
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
    [entries, locale],
  );

  const renderFilterCell = useCallback(
    (fieldKey: TableFieldKey) => {
      const config = TABLE_FIELDS_CONFIG[fieldKey];
      const filter = columnFilters.find((f) => f.id === fieldKey);

      // Render cell with reserved space for filter badge
      return (
        <div
          key={`filter-${fieldKey}`}
          className={config.cellClassName}
          style={{ minHeight: "48px", paddingTop: "8px", paddingBottom: "8px" }}
        >
          {filter &&
            (() => {
              const displayValue = getFilterDisplayValue(filter);
              if (displayValue) {
                return (
                  <Badge className="gap-0" variant="outline">
                    {displayValue}
                    <button
                      className="focus-visible:border-ring focus-visible:ring-ring/50 text-primary-foreground/60 hover:text-primary-foreground -my-px -ms-px -me-1.5 inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-[inherit] p-0 transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
                      onClick={() => removeFilter(filter.id)}
                    >
                      <X size={12} aria-hidden="true" />
                    </button>
                  </Badge>
                );
              }
              return null;
            })()}
        </div>
      );
    },
    [columnFilters, getFilterDisplayValue, removeFilter],
  );

  // Always render the filter row with reserved space to prevent UI jumping
  return (
    <div
      className="border-b border-gray-100 bg-gray-50/50"
      style={{
        display: "grid",
        gridTemplateColumns: GRID_TEMPLATE_COLUMNS,
        minHeight: "48px",
      }}
    >
      {VISIBLE_FIELDS.map(renderFilterCell)}
    </div>
  );
});
