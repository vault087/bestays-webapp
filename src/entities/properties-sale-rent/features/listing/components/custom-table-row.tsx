"use client";

import Image from "next/image";
import { memo, useCallback } from "react";
import { moneyToString } from "@/entities/common";
import { DBDictionaryEntry } from "@/entities/dictionaries";
import { getAvailableLocalizedText } from "@/entities/localized-text/utils/get-available-localized-text";
import {
  TABLE_FIELDS_CONFIG,
  VISIBLE_FIELDS,
  GRID_TEMPLATE_COLUMNS,
  type TableFieldKey,
} from "@/entities/properties-sale-rent/features/listing/types/table-fields.types";
import { DashboardProperty } from "@/entities/properties-sale-rent/libs/load-properties";
import { cn } from "@/modules/shadcn/utils/cn";
import { capitalize } from "@/utils/capitalize";

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
    const coverImageURL = row.cover_image?.url;
    return (
      <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-md">
        {coverImageURL && <Image src={coverImageURL} alt="Property" fill className="object-cover" />}
        {!coverImageURL && <span className="text-center text-xs text-gray-400">No image</span>}
      </div>
    );
  }, [row.cover_image]);

  const renderPersonalTitle = useCallback(() => {
    const title = row.personal_title;
    return (
      <div className="flex h-full w-full items-center justify-center">
        {title && <div className="font-medium text-gray-900">{title}</div>}
        {!title && <span className="text-gray-500 italic">No title</span>}
      </div>
    );
  }, [row.personal_title]);

  const renderDictionaryValue = useCallback(
    (value: string | null, fieldKey: string) => {
      if (!value) {
        return <span className="text-gray-500"></span>;
      }

      // Find the original ID field
      const originalIdField = `${fieldKey}_id` as keyof DashboardProperty;
      const originalId = row[originalIdField] as number | null;

      if (originalId) {
        const entry = entries.find((e) => e.id === originalId);
        if (entry) {
          return <span className="text-gray-900">{capitalize(getAvailableLocalizedText(entry.name, locale))}</span>;
        }
      }

      return (
        <div className="flex h-full w-full items-center justify-center">
          <span className="flex w-full justify-center text-center text-gray-900">{value}</span>
        </div>
      );
    },
    [row, entries, locale],
  );

  const renderPrice = useCallback(
    (price: number | null, type: "sale" | "rent") => {
      const isEnabled = type === "sale" ? row.sale_enabled : row.rent_enabled;

      return (
        <div className="flex h-full w-full items-center justify-center">
          {price && (
            <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-yellow-600/20 ring-inset">
              <div className={cn("text-center text-sm", isEnabled ? "text-green-800" : "text-gray-600")}>
                {moneyToString(price)}
              </div>
            </span>
          )}
          {!price && <div className={cn("text-center", isEnabled ? "text-green-800" : "text-gray-600")}>Not set</div>}
          {/* </span> */}
        </div>
      );
    },
    [row.sale_enabled, row.rent_enabled],
  );

  const renderPublishedStatus = useCallback(() => {
    const isPublished = row.is_published;
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span
          className={cn(
            "inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium",
            isPublished ? "text-green-800" : "text-gray-800",
          )}
        >
          {isPublished ? "Published" : "Draft"}
        </span>
      </div>
    );
  }, [row.is_published]);

  const renderRelativeTime = useCallback(() => {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="text-center text-sm text-gray-500">{row.updated_at}</span>
      </div>
    );
  }, [row.updated_at]);

  const renderCell = useCallback(
    (fieldKey: TableFieldKey) => {
      const config = TABLE_FIELDS_CONFIG[fieldKey];
      const value = row[fieldKey];

      // Use custom cell renderer if available
      if (config.cellRenderer) {
        return (
          <div key={fieldKey} className={cn(config.cellClassName)}>
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
        case "rent_enabled":
          cellContent = renderPrice(row.rent_price ?? null, "rent");
          break;
        case "sale_enabled":
          cellContent = renderPrice(row.sale_price ?? null, "sale");
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
            <span className="text-gray-500"></span>
          );
      }

      return (
        <div key={fieldKey} className={cn(config.cellClassName, "")}>
          {cellContent}
        </div>
      );
    },
    [
      row,
      renderCoverImage,
      renderPersonalTitle,
      renderDictionaryValue,
      renderPrice,
      renderPublishedStatus,
      renderRelativeTime,
    ],
  );

  return (
    <div
      className={cn("cursor-pointer border-gray-100 transition-colors hover:bg-gray-50", !isLast && "border-b")}
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
