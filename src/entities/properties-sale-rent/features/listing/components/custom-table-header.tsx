"use client";

import { ArrowUpDown, ArrowDownNarrowWide, ArrowUpNarrowWide, ChevronDown } from "lucide-react";
import { memo } from "react";
import { Button } from "@/modules/shadcn";
import { cn } from "@/modules/shadcn/utils/cn";
import { TableFieldConfig, GRID_TEMPLATE_COLUMNS } from "@/entities/properties-sale-rent/features/listing/types/table-fields.types";

interface CustomTableHeaderProps {
  fields: TableFieldConfig[];
  getSortDirection: (fieldKey: string) => "asc" | "desc" | null;
  onSort: (fieldKey: string) => void;
  onFilterOpen: (fieldKey: string) => void;
}

/**
 * Custom table header component with sorting icons and filter dropdowns
 * Follows project patterns for header structure and icons
 */
export const CustomTableHeader = memo(function CustomTableHeader({
  fields,
  getSortDirection,
  onSort,
  onFilterOpen,
}: CustomTableHeaderProps) {
  return (
    <div 
      className="grid border-b bg-muted/50 h-12"
      style={{ gridTemplateColumns: GRID_TEMPLATE_COLUMNS }}
    >
      {fields.map((field) => (
        <CustomTableHeaderCell
          key={field.key}
          field={field}
          sortDirection={getSortDirection(field.key)}
          onSort={() => onSort(field.key)}
          onFilter={() => field.filterable && onFilterOpen(field.key)}
        />
      ))}
    </div>
  );
});

interface CustomTableHeaderCellProps {
  field: TableFieldConfig;
  sortDirection: "asc" | "desc" | null;
  onSort: () => void;
  onFilter: () => void;
}

/**
 * Individual header cell with sorting and filtering capabilities
 * Follows existing project patterns for icons and interaction
 */
const CustomTableHeaderCell = memo(function CustomTableHeaderCell({
  field,
  sortDirection,
  onSort,
  onFilter,
}: CustomTableHeaderCellProps) {
  // Sort icon logic following existing patterns
  const SortIcon = sortDirection === "desc" 
    ? ArrowDownNarrowWide 
    : sortDirection === "asc" 
    ? ArrowUpNarrowWide 
    : ArrowUpDown;

  return (
    <div className={cn(
      "flex items-center px-4 h-12",
      field.align === "center" && "justify-center",
      field.align === "right" && "justify-end",
      field.align === "left" && "justify-start"
    )}>
      {/* Title section - filterable or plain */}
      <div className="flex items-center flex-1 min-w-0">
        {field.filterable ? (
          <Button
            variant="ghost"
            onClick={onFilter}
            className={cn(
              "hover:bg-muted/50 focus:bg-muted h-auto p-1 rounded-sm",
              "text-sm font-medium tracking-wide",
              "flex items-center gap-1 min-w-0"
            )}
          >
            <span className="truncate">{field.title}</span>
            <ChevronDown className="w-4 h-4 opacity-60" />
          </Button>
        ) : (
          <span className="text-sm font-medium tracking-wide truncate">
            {field.title}
          </span>
        )}
      </div>

      {/* Sorting button - only for sortable fields */}
      {field.sortable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSort();
          }}
          className="hover:bg-muted/30 ml-2 rounded p-1 transition-colors flex-shrink-0"
          aria-label={`Sort by ${field.title}`}
        >
          <SortIcon className="h-4 w-4 opacity-60 transition-opacity hover:opacity-100" />
        </button>
      )}
    </div>
  );
}); 