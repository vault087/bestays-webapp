"use client";

import { ArrowUpDown, ArrowUp, ArrowDown, ChevronDown } from "lucide-react";
import { memo, useCallback } from "react";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/modules/shadcn";
import { cn } from "@/modules/shadcn/utils/cn";
import {
  TABLE_FIELDS_CONFIG,
  VISIBLE_FIELDS,
  GRID_TEMPLATE_COLUMNS,
  type SortableFieldKey,
  type TableFieldKey,
} from "@/entities/properties-sale-rent/features/listing/types/table-fields.types";

interface CustomTableHeaderProps {
  sorting: Array<{ id: string; desc: boolean }>;
  setSorting: (sorting: Array<{ id: string; desc: boolean }>) => void;
}

export const CustomTableHeader = memo(function CustomTableHeader({
  sorting,
  setSorting,
}: CustomTableHeaderProps) {
  const getSortDirection = useCallback(
    (fieldKey: TableFieldKey): "asc" | "desc" | null => {
      const sortItem = sorting.find((item) => item.id === fieldKey);
      if (!sortItem) return null;
      return sortItem.desc ? "desc" : "asc";
    },
    [sorting]
  );

  const handleSort = useCallback(
    (fieldKey: SortableFieldKey) => {
      const currentSort = getSortDirection(fieldKey);
      
      if (!currentSort) {
        // No current sort - set to ascending
        setSorting([{ id: fieldKey, desc: false }]);
      } else if (currentSort === "asc") {
        // Currently ascending - change to descending
        setSorting([{ id: fieldKey, desc: true }]);
      } else {
        // Currently descending - remove sort
        setSorting([]);
      }
    },
    [getSortDirection, setSorting]
  );

  const renderSortIcon = useCallback((fieldKey: TableFieldKey) => {
    const config = TABLE_FIELDS_CONFIG[fieldKey];
    if (!config.sortable) return null;

    const sortDirection = getSortDirection(fieldKey);
    const iconSize = "h-4 w-4";
    
    if (sortDirection === "asc") {
      return <ArrowUp className={cn(iconSize, "text-blue-600")} />;
    } else if (sortDirection === "desc") {
      return <ArrowDown className={cn(iconSize, "text-blue-600")} />;
    } else {
      return <ArrowUpDown className={cn(iconSize, "text-gray-400")} />;
    }
  }, [getSortDirection]);

  const renderHeaderCell = useCallback(
    (fieldKey: TableFieldKey) => {
      const config = TABLE_FIELDS_CONFIG[fieldKey];
      const sortDirection = getSortDirection(fieldKey);

      // For cover_image column, render empty cell
      if (fieldKey === "cover_image") {
        return (
          <div
            key={fieldKey}
            className={cn(config.headerClassName)}
          >
            {/* Empty cell for image column */}
          </div>
        );
      }

      // For sortable columns, render clickable header with sort icon
      if (config.sortable) {
        return (
          <div
            key={fieldKey}
            className={cn(config.headerClassName)}
          >
            <Button
              variant="ghost"
              className={cn(
                "inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer h-auto p-0",
                sortDirection && "text-blue-600"
              )}
              onClick={() => handleSort(fieldKey as SortableFieldKey)}
            >
              <span>{config.label}</span>
              <div className="ml-1">
                {renderSortIcon(fieldKey)}
              </div>
            </Button>
          </div>
        );
      }

      // For non-sortable columns, render plain text
      return (
        <div
          key={fieldKey}
          className={cn(config.headerClassName)}
        >
          <span className="text-sm font-medium text-gray-700">
            {config.label}
          </span>
        </div>
      );
    },
    [getSortDirection, handleSort, renderSortIcon]
  );

  return (
    <div
      className="border-b border-gray-200 bg-gray-50"
      style={{
        display: "grid",
        gridTemplateColumns: GRID_TEMPLATE_COLUMNS,
      }}
    >
      {VISIBLE_FIELDS.map(renderHeaderCell)}
    </div>
  );
});

// Header with dropdown functionality for future expansion
interface HeaderWithDropdownProps {
  fieldKey: TableFieldKey;
  setSorting: (sorting: Array<{ id: string; desc: boolean }>) => void;
}

export const HeaderWithDropdown = memo(function HeaderWithDropdown({
  fieldKey,
  setSorting,
}: HeaderWithDropdownProps) {
  const config = TABLE_FIELDS_CONFIG[fieldKey];

  const handleSortAsc = () => {
    setSorting([{ id: fieldKey, desc: false }]);
  };

  const handleSortDesc = () => {
    setSorting([{ id: fieldKey, desc: true }]);
  };

  const handleHideColumn = () => {
    // Future functionality to hide columns
    console.log(`Hide column: ${fieldKey}`);
  };

  if (!config.sortable) {
    return <span className="text-sm font-medium text-gray-700">{config.label}</span>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer h-auto p-0"
        >
          <span>{config.label}</span>
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[180px] bg-white border border-gray-200 rounded-md shadow-lg py-1">
        <DropdownMenuItem
          onClick={handleSortAsc}
          className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
        >
          Sort by ASC
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleSortDesc}
          className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
        >
          Sort by DESC
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleHideColumn}
          className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
        >
          Hide column
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}); 