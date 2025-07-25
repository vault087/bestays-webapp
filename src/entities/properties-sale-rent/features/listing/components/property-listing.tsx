"use client";

import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DBDictionary, DBDictionaryEntry } from "@/entities/dictionaries";
import { getAvailableLocalizedText } from "@/entities/localized-text/utils/get-available-localized-text";
import { PropertyFieldToDictionaryCodeMap } from "@/entities/properties-sale-rent/types/property-fields.types";
import { FilterTags } from "./filter-tags";
import { PropertyListingTable } from "./property-listing-table";
import { PropertyListingProps, PropertyRow } from "./types";

export function PropertyListing({ properties, dictionaries, entries, locale }: PropertyListingProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([{ id: "updated_at", desc: true }]);

  // Create lookup maps for dictionary entries
  const dictionaryByCode = useMemo(() => {
    return dictionaries.reduce(
      (acc, dict) => {
        acc[dict.code] = dict;
        return acc;
      },
      {} as Record<string, DBDictionary>,
    );
  }, [dictionaries]);

  const entriesByDictionaryId = useMemo(() => {
    return entries.reduce(
      (acc, entry) => {
        if (!acc[entry.dictionary_id]) {
          acc[entry.dictionary_id] = {};
        }
        acc[entry.dictionary_id][entry.id] = entry;
        return acc;
      },
      {} as Record<number, Record<number, DBDictionaryEntry>>,
    );
  }, [entries]);

  // Transform properties to table rows with custom filtering logic
  const tableData = useMemo(() => {
    return properties.map((property): PropertyRow => {
      // Get dictionary entries for property_type and area
      const propertyTypeDict = dictionaryByCode[PropertyFieldToDictionaryCodeMap.property_type];
      const areaDict = dictionaryByCode[PropertyFieldToDictionaryCodeMap.area];

      const propertyTypeEntry =
        property.property_type && propertyTypeDict
          ? entriesByDictionaryId[propertyTypeDict.id]?.[property.property_type]
          : null;
      const areaEntry = property.area && areaDict ? entriesByDictionaryId[areaDict.id]?.[property.area] : null;

      return {
        id: property.id,
        personal_title: property.personal_title || null,
        property_type: propertyTypeEntry ? getAvailableLocalizedText(propertyTypeEntry.name, locale) : null,
        area: areaEntry ? getAvailableLocalizedText(areaEntry.name, locale) : null,
        rent_price: property.rent_price || null,
        sale_price: property.sale_price || null,
        rent_enabled: property.rent_enabled ?? null,
        sale_enabled: property.sale_enabled ?? null,
        cover_image: property.cover_image ? (property.cover_image as { url?: string }) : null,
        is_published: property.is_published ?? null,
        updated_at: property.updated_at ?? null,
        // Store the original entry IDs for filtering
        property_type_id: property.property_type,
        area_id: property.area,
      };
    });
  }, [properties, dictionaryByCode, entriesByDictionaryId, locale]);

  const handleFilterEdit = (columnId: string) => {
    // For now, this could trigger focus on the specific filter dropdown
    // Implementation can be enhanced later if needed
    console.log("Edit filter:", columnId);
  };

  return (
    <div className="space-y-4">
      <FilterTags
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        dictionaries={dictionaries}
        entries={entries}
        locale={locale}
        onFilterEdit={handleFilterEdit}
      />

      <PropertyListingTable
        data={tableData}
        dictionaries={dictionaries}
        entries={entries}
        locale={locale}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        sorting={sorting}
        setSorting={setSorting}
      />
    </div>
  );
}
