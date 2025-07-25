"use client";

import { X } from "lucide-react";
import { memo } from "react";
import { ColumnFiltersState } from "@tanstack/react-table";
import { Button } from "@/modules/shadcn";
import { cn } from "@/modules/shadcn/utils/cn";
import { TableFieldConfig, GRID_TEMPLATE_COLUMNS } from "@/entities/properties-sale-rent/features/listing/types/table-fields.types";

interface CustomFilterRowProps {
  fields: TableFieldConfig[];
  columnFilters: ColumnFiltersState;
  getFilterDisplayValue: (filter: { id: string; value: string | boolean | number }) => string;
  onRemoveFilter: (fieldKey: string) => void;
}

/**
 * Custom filter row component with perfect column alignment
 * Uses CSS Grid to match header columns exactly
 */
export const CustomFilterRow = memo(function CustomFilterRow({
  fields,
  columnFilters,
  getFilterDisplayValue,
  onRemoveFilter,
}: CustomFilterRowProps) {
  if (columnFilters.length === 0) return null;

  return (
    <div 
      className="grid border-b bg-muted/20 py-2 min-h-[40px]"
      style={{ gridTemplateColumns: GRID_TEMPLATE_COLUMNS }}
    >
      {fields.map((field) => {
        const filter = columnFilters.find((f) => f.id === field.key);
        
        return (
          <div 
            key={field.key} 
            className={cn(
              "flex items-center px-4",
              field.align === "center" && "justify-center",
              field.align === "right" && "justify-end", 
              field.align === "left" && "justify-start"
            )}
          >
            {filter && (
              <FilterChip 
                value={getFilterDisplayValue(filter)}
                onRemove={() => onRemoveFilter(field.key)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
});

interface FilterChipProps {
  value: string;
  onRemove: () => void;
}

/**
 * Optimized filter chip component with proper styling
 * Follows project patterns for interactive elements
 */
const FilterChip = memo(function FilterChip({ value, onRemove }: FilterChipProps) {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-md text-xs border border-blue-200">
      <span className="text-blue-800 font-medium">{value}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="h-4 w-4 p-0 hover:bg-blue-200 rounded-full transition-colors"
        aria-label="Remove filter"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}); 