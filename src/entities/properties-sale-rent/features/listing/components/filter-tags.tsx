"use client";

import { ColumnFiltersState } from "@tanstack/react-table";
import { ChevronsUpDown, X } from "lucide-react";
import { useMemo } from "react";
import { DBDictionary, DBDictionaryEntry } from "@/entities/dictionaries";
import { getAvailableLocalizedText } from "@/entities/localized-text/utils/get-available-localized-text";
import { PropertyFieldToDictionaryCodeMap } from "@/entities/properties-sale-rent/types/property-fields.types";
import { capitalize } from "@/utils/capitalize";

interface FilterTagsProps {
  columnFilters: ColumnFiltersState;
  setColumnFilters: (filters: ColumnFiltersState | ((prev: ColumnFiltersState) => ColumnFiltersState)) => void;
  dictionaries: DBDictionary[];
  entries: DBDictionaryEntry[];
  locale: string;
  onFilterEdit?: (columnId: string) => void;
}

interface FilterTag {
  id: string;
  label: string;
  value: string;
  displayValue: string;
}

export function FilterTags({
  columnFilters,
  setColumnFilters,
  dictionaries,
  entries,
  locale,
  onFilterEdit,
}: FilterTagsProps) {
  const filterTags = useMemo(() => {
    const tags: FilterTag[] = [];

    columnFilters.forEach((filter) => {
      if (filter.value === undefined) return;

      let displayValue = "";
      let label = "";

      // Handle dictionary filters
      if (filter.id === "property_type") {
        label = "Property type";
        const dictionary = dictionaries.find((d) => d.code === PropertyFieldToDictionaryCodeMap.property_type);
        if (dictionary) {
          const entry = entries.find(
            (e) => e.dictionary_id === dictionary.id && e.id.toString() === filter.value
          );
          if (entry) {
            displayValue = capitalize(getAvailableLocalizedText(entry.name, locale));
          }
        }
      } else if (filter.id === "area") {
        label = "Area";
        const dictionary = dictionaries.find((d) => d.code === PropertyFieldToDictionaryCodeMap.area);
        if (dictionary) {
          const entry = entries.find(
            (e) => e.dictionary_id === dictionary.id && e.id.toString() === filter.value
          );
          if (entry) {
            displayValue = capitalize(getAvailableLocalizedText(entry.name, locale));
          }
        }
      }
      // Handle boolean filters
      else if (filter.id === "rent_enabled") {
        label = "For rent";
        displayValue = filter.value ? capitalize("yes") : capitalize("no");
      } else if (filter.id === "sale_enabled") {
        label = "For sale";
        displayValue = filter.value ? capitalize("yes") : capitalize("no");
      } else if (filter.id === "is_published") {
        label = "Published";
        displayValue = filter.value ? capitalize("yes") : capitalize("no");
      }

      if (displayValue && label) {
        tags.push({
          id: filter.id,
          label,
          value: filter.value as string,
          displayValue,
        });
      }
    });

    return tags;
  }, [columnFilters, dictionaries, entries, locale]);

  const removeFilter = (filterId: string) => {
    setColumnFilters((prev) => prev.filter((filter) => filter.id !== filterId));
  };

  const editFilter = (filterId: string) => {
    onFilterEdit?.(filterId);
  };

  if (filterTags.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {filterTags.map((tag) => (
        <div
          key={tag.id}
          className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-sm shadow-sm hover:bg-muted/50 transition-colors cursor-pointer"
          onClick={() => editFilter(tag.id)}
        >
          <ChevronsUpDown className="h-3 w-3 text-primary" />
          <span className="font-medium text-muted-foreground">{tag.label}:</span>
          <span className="font-medium">{tag.displayValue}</span>
          <button
            className="ml-1 rounded-sm p-0.5 hover:bg-muted transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              removeFilter(tag.id);
            }}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
} 