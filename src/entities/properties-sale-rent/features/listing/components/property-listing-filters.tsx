"use client";

import { ColumnFilter, ColumnFiltersState } from "@tanstack/react-table";
import { useMemo } from "react";
import { FormDropDown } from "@/components/form/inputs/form-dropdown";
import { FormOption } from "@/components/form/types/form-option";
import { DBDictionary, DBDictionaryEntry } from "@/entities/dictionaries";
import { getAvailableLocalizedText } from "@/entities/localized-text/utils/get-available-localized-text";
import { PropertyFieldToDictionaryCodeMap } from "@/entities/properties-sale-rent/types/property-fields.types";

interface PropertyListingFiltersProps {
  columnFilters: ColumnFiltersState;
  setColumnFilters: (updater: ColumnFiltersState | ((prev: ColumnFiltersState) => ColumnFiltersState)) => void;
  dictionaries: DBDictionary[];
  entries: DBDictionaryEntry[];
  locale: string;
}

type FilterState = "all" | "true" | "false";

interface BooleanFilterProps {
  value: FilterState;
  onChange: (value: FilterState) => void;
  label: string;
}

function BooleanFilter({ value, onChange, label }: BooleanFilterProps) {
  const options: FormOption[] = [
    { key: "all", label: "All" },
    { key: "true", label: "Yes" },
    { key: "false", label: "No" },
  ];

  const selectedOption = options.find((opt) => opt.key === value) || options[0];

  const selectOption = (option: FormOption) => {
    onChange(option.key as FilterState);
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-foreground text-sm font-medium">{label}</label>
      <div className="w-32">
        <FormDropDown
          selectedOption={selectedOption}
          options={options}
          selectOption={selectOption}
          placeholder="All"
          className="min-w-0"
        />
      </div>
    </div>
  );
}

interface DictionaryFilterProps {
  dictionaryCode: string;
  value: string;
  onChange: (value: string) => void;
  dictionaries: DBDictionary[];
  entries: DBDictionaryEntry[];
  locale: string;
}

function DictionaryFilter({ dictionaryCode, value, onChange, dictionaries, entries, locale }: DictionaryFilterProps) {
  const dictionary = dictionaries.find((d) => d.code === dictionaryCode);

  const options: FormOption[] = useMemo(() => {
    const dictionaryEntries = dictionary ? entries.filter((e) => e.dictionary_id === dictionary.id) : [];
    const allOption = { key: "all", label: "All" };
    const entryOptions = dictionaryEntries
      .map((entry) => ({
        key: entry.id.toString(),
        label: getAvailableLocalizedText(entry.name, locale),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return [allOption, ...entryOptions];
  }, [dictionary, entries, locale]);

  const selectedOption = options.find((opt) => opt.key === value) || options[0];
  const title = dictionary ? getAvailableLocalizedText(dictionary.name, locale) : dictionaryCode;

  const selectOption = (option: FormOption) => {
    onChange(option.key);
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-foreground text-sm font-medium">{title}</label>
      <div className="w-36">
        <FormDropDown
          selectedOption={selectedOption}
          options={options}
          selectOption={selectOption}
          placeholder="All"
          className="min-w-0"
        />
      </div>
    </div>
  );
}

export function PropertyListingFilters({
  columnFilters,
  setColumnFilters,
  dictionaries,
  entries,
  locale,
}: PropertyListingFiltersProps) {
  // Helper functions to get and set filter values
  const getFilterValue = (columnId: string): string => {
    const filter = columnFilters.find((f: ColumnFilter) => f.id === columnId);
    return (filter?.value as string) || "all";
  };

  const setFilterValue = (columnId: string, value: string | boolean | undefined) => {
    setColumnFilters((prev: ColumnFiltersState): ColumnFiltersState => {
      if (value === undefined) {
        return prev.filter((f: ColumnFilter) => f.id !== columnId);
      }

      const existing = prev.find((f: ColumnFilter) => f.id === columnId);
      if (existing) {
        return prev.map((f: ColumnFilter) => (f.id === columnId ? { ...f, value } : f));
      } else {
        return [...prev, { id: columnId, value }];
      }
    });
  };

  // Get current filter values
  const propertyTypeFilter = getFilterValue("property_type");
  const areaFilter = getFilterValue("area");
  const publishedFilter = (getFilterValue("is_published") as FilterState) || "all";
  const rentFilter = (getFilterValue("rent_enabled") as FilterState) || "all";
  const saleFilter = (getFilterValue("sale_enabled") as FilterState) || "all";

  // Handler functions
  const handlePropertyTypeChange = (value: string) => {
    setFilterValue("property_type", value === "all" ? undefined : value);
  };

  const handleAreaChange = (value: string) => {
    setFilterValue("area", value === "all" ? undefined : value);
  };

  const handlePublishedChange = (value: FilterState) => {
    setFilterValue("is_published", value === "all" ? undefined : value === "true");
  };

  const handleRentChange = (value: FilterState) => {
    setFilterValue("rent_enabled", value === "all" ? undefined : value === "true");
  };

  const handleSaleChange = (value: FilterState) => {
    setFilterValue("sale_enabled", value === "all" ? undefined : value === "true");
  };

  return (
    <div className="bg-muted/30 flex flex-wrap gap-4 rounded-lg p-4">
      <DictionaryFilter
        dictionaryCode={PropertyFieldToDictionaryCodeMap.property_type}
        value={propertyTypeFilter}
        onChange={handlePropertyTypeChange}
        dictionaries={dictionaries}
        entries={entries}
        locale={locale}
      />

      <DictionaryFilter
        dictionaryCode={PropertyFieldToDictionaryCodeMap.area}
        value={areaFilter}
        onChange={handleAreaChange}
        dictionaries={dictionaries}
        entries={entries}
        locale={locale}
      />

      <BooleanFilter value={publishedFilter} onChange={handlePublishedChange} label="Published" />

      <BooleanFilter value={rentFilter} onChange={handleRentChange} label="For Rent" />

      <BooleanFilter value={saleFilter} onChange={handleSaleChange} label="For Sale" />
    </div>
  );
}
