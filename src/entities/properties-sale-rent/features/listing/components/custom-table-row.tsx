"use client";

import { memo } from "react";
import { cn } from "@/modules/shadcn/utils/cn";
import { TableFieldConfig, GRID_TEMPLATE_COLUMNS } from "@/entities/properties-sale-rent/features/listing/types/table-fields.types";
import { PropertyRow } from "./types";

interface CustomTableRowProps {
  fields: TableFieldConfig[];
  data: PropertyRow;
  onClick: (id: string) => void;
}

/**
 * Custom table row component with efficient rendering
 * Uses CSS Grid for perfect alignment with headers
 */
export const CustomTableRow = memo(function CustomTableRow({
  fields,
  data,
  onClick,
}: CustomTableRowProps) {
  return (
    <div 
      className="grid border-b hover:bg-muted/50 cursor-pointer transition-colors min-h-[64px]"
      style={{ gridTemplateColumns: GRID_TEMPLATE_COLUMNS }}
      onClick={() => onClick(data.id)}
    >
      {fields.map((field) => (
        <CustomTableCell 
          key={field.key}
          field={field}
          value={data[field.key]}
          data={data}
        />
      ))}
    </div>
  );
});

interface CustomTableCellProps {
  field: TableFieldConfig;
  value: unknown;
  data: PropertyRow;
}

/**
 * Individual table cell component with custom rendering support
 * Follows project patterns for cell content and alignment
 */
const CustomTableCell = memo(function CustomTableCell({ 
  field, 
  value, 
  data 
}: CustomTableCellProps) {
  // Use custom render function if provided, otherwise default rendering
  const content = field.render 
    ? field.render(value, data) 
    : renderDefaultValue(value);
  
  return (
    <div className={cn(
      "flex items-center px-4 py-2 min-h-[64px]",
      field.align === "center" && "justify-center",
      field.align === "right" && "justify-end",
      field.align === "left" && "justify-start"
    )}>
      {content}
    </div>
  );
});

/**
 * Default value rendering following project patterns
 */
function renderDefaultValue(value: unknown): React.ReactNode {
  if (value == null) {
    return <span className="text-muted-foreground">—</span>;
  }
  
  if (typeof value === "boolean") {
    return <span className="text-xs">{value ? "Yes" : "No"}</span>;
  }
  
  if (typeof value === "string" && value.trim() === "") {
    return <span className="text-muted-foreground italic">No title</span>;
  }
  
  return <span>{String(value)}</span>;
} 