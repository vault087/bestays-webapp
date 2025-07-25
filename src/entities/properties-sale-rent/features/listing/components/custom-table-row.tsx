"use client";

import { memo, useCallback } from "react";
import { DBDictionaryEntry } from "@/entities/dictionaries";
import { getAvailableLocalizedText } from "@/entities/localized-text/utils/get-available-localized-text";
import { DashboardProperty } from "@/entities/properties-sale-rent/libs/load-properties";
import { cn } from "@/modules/shadcn/utils/cn";
import { capitalize } from "@/utils/capitalize";
import {
  TABLE_FIELDS_CONFIG,
  VISIBLE_FIELDS,
  GRID_TEMPLATE_COLUMNS,
  type TableFieldKey,
} from "@/entities/properties-sale-rent/features/listing/types/table-fields.types";

interface CustomTableRowProps {
  row: DashboardProperty;
  entries: DBDictionaryEntry[];
  locale: string;
  onClick?: (propertyId: string) => void;
  isLast?: boolean;
}

export const CustomTableRow = memo(function CustomTableRow({
  row,
  entries,
  locale,
  onClick,
  isLast = false,
}: CustomTableRowProps) {
  const handleRowClick = useCallback(() => {
    if (onClick && row.id) {
      onClick(row.id);
    }
  }, [onClick, row.id]);

  const renderCoverImage = useCallback(() => {
    const coverImage = row.cover_image;
    if (coverImage?.url) {
      return (
        <img
          src={coverImage.url}
          alt="Property"
          className="h-12 w-12 rounded-md object-cover border border-gray-200"
        />
      );
    }
    return (
      <div className="h-12 w-12 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center">
        <span className="text-gray-400 text-xs">No image</span>
      </div>
    );
  }, [row.cover_image]);

  const renderPersonalTitle = useCallback(() => {
    const title = row.personal_title;
    if (title) {
      return (
        <div className="flex items-center space-x-3">
          <div>
            <div className="font-medium text-gray-900">{title}</div>
          </div>
        </div>
      );
    }
    return (
      <span className="text-gray-500 italic">No title</span>
    );
  }, [row.personal_title]);

  const renderDictionaryValue = useCallback(
    (value: string | null, fieldKey: string) => {
      if (!value) {
        return <span className="text-gray-500">—</span>;
      }

      // Find the original ID field
      const originalIdField = `${fieldKey}_id` as keyof DashboardProperty;
      const originalId = row[originalIdField] as number | null;
      
      if (originalId) {
        const entry = entries.find((e) => e.id === originalId);
        if (entry) {
          return (
            <span className="text-gray-900">
              {capitalize(getAvailableLocalizedText(entry.name, locale))}
            </span>
          );
        }
      }

      return <span className="text-gray-900">{value}</span>;
    },
    [row, entries, locale]
  );

  const renderPrice = useCallback((price: number | null, type: "sale" | "rent") => {
    if (price) {
      const isEnabled = type === "sale" ? row.sale_enabled : row.rent_enabled;
      if (isEnabled) {
        return (
          <div className="text-right">
            <span className="font-semibold text-gray-900">
              ฿{price.toLocaleString()}
            </span>
          </div>
        );
      }
    }
    return (
      <div className="text-right">
        <span className="text-gray-500">—</span>
      </div>
    );
  }, [row.sale_enabled, row.rent_enabled]);

  const renderPublishedStatus = useCallback(() => {
    const isPublished = row.is_published;
    if (isPublished === true) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
          Published
        </span>
      );
    } else if (isPublished === false) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
          Draft
        </span>
      );
    }
    return (
      <span className="text-gray-500">—</span>
    );
  }, [row.is_published]);

  const renderRelativeTime = useCallback(() => {
    const updatedAt = row.updated_at;
    if (updatedAt) {
      const date = new Date(updatedAt);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffMs / (1000 * 60));

      let timeAgo: string;
      if (diffDays > 0) {
        timeAgo = `${diffDays}d ago`;
      } else if (diffHours > 0) {
        timeAgo = `${diffHours}h ago`;
      } else if (diffMinutes > 0) {
        timeAgo = `${diffMinutes}m ago`;
      } else {
        timeAgo = "Just now";
      }

      return (
        <span className="text-sm text-gray-500" title={date.toLocaleString()}>
          {timeAgo}
        </span>
      );
    }
    return (
      <span className="text-gray-500">—</span>
    );
  }, [row.updated_at]);

  const renderCell = useCallback(
    (fieldKey: TableFieldKey) => {
      const config = TABLE_FIELDS_CONFIG[fieldKey];
      const value = row[fieldKey];

      // Use custom cell renderer if available
      if (config.cellRenderer) {
        return (
          <div
            key={fieldKey}
            className={cn(config.cellClassName)}
          >
            {config.cellRenderer(value, row)}
          </div>
        );
      }

      // Default cell rendering based on field type
      let cellContent;
      switch (fieldKey) {
        case "cover_image":
          cellContent = renderCoverImage();
          break;
        case "personal_title":
          cellContent = renderPersonalTitle();
          break;
        case "property_type":
          cellContent = renderDictionaryValue(value as string | null, "property_type");
          break;
        case "area":
          cellContent = renderDictionaryValue(value as string | null, "area");
          break;
        case "sale_price":
          cellContent = renderPrice(value as number | null, "sale");
          break;
        case "rent_price":
          cellContent = renderPrice(value as number | null, "rent");
          break;
        case "is_published":
          cellContent = renderPublishedStatus();
          break;
        case "updated_at":
          cellContent = renderRelativeTime();
          break;
        default:
          cellContent = value ? (
            <span className="text-sm text-gray-900">{value.toString()}</span>
          ) : (
            <span className="text-gray-500">—</span>
          );
      }

      return (
        <div
          key={fieldKey}
          className={cn(config.cellClassName)}
        >
          {cellContent}
        </div>
      );
    },
    [row, renderCoverImage, renderPersonalTitle, renderDictionaryValue, renderPrice, renderPublishedStatus, renderRelativeTime]
  );

  return (
    <div
      className={cn(
        "border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer",
        !isLast && "border-b"
      )}
      style={{
        display: "grid",
        gridTemplateColumns: GRID_TEMPLATE_COLUMNS,
      }}
      onClick={handleRowClick}
    >
      {VISIBLE_FIELDS.map(renderCell)}
    </div>
  );
}); 