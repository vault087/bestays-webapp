"use client";

import { Column } from "@tanstack/react-table";
import { useMemo } from "react";
import { FormDropDown } from "@/components/form/inputs/form-dropdown";
import { FormOption } from "@/components/form/types/form-option";
import { DBDictionary, DBDictionaryEntry } from "@/entities/dictionaries";
import { getAvailableLocalizedText } from "@/entities/localized-text/utils/get-available-localized-text";
import { capitalize } from "@/utils/capitalize";
import { PropertyRow } from "./types";

interface BooleanHeaderFilterProps {
  column: Column<PropertyRow, unknown>;
}

export function BooleanHeaderFilter({ column }: BooleanHeaderFilterProps) {
  const filterValue = column.getFilterValue() as boolean | undefined;

  const options: FormOption[] = [
    { key: "all", label: capitalize("all") },
    { key: "true", label: capitalize("yes") },
    { key: "false", label: capitalize("no") },
  ];

  const selectedOption =
    options.find((opt) => {
      if (filterValue === undefined) return opt.key === "all";
      return opt.key === filterValue.toString();
    }) || options[0];

  const selectOption = (option: FormOption) => {
    if (option.key === "all") {
      column.setFilterValue(undefined);
    } else {
      column.setFilterValue(option.key === "true");
    }
  };

  return (
    <div className="absolute top-full left-0 z-10 mt-1 w-20" onClick={(e) => e.stopPropagation()}>
      <FormDropDown
        selectedOption={selectedOption}
        options={options}
        selectOption={selectOption}
        placeholder={capitalize("all")}
        className="hover:bg-muted/50 focus:bg-muted h-7 min-w-0 rounded-sm border-0 bg-transparent text-xs tracking-wide transition-colors"
      />
    </div>
  );
}

interface DictionaryHeaderFilterProps {
  column: Column<PropertyRow, unknown>;
  dictionaryCode: string;
  dictionaries: DBDictionary[];
  entries: DBDictionaryEntry[];
  locale: string;
}

export function DictionaryHeaderFilter({
  column,
  dictionaryCode,
  dictionaries,
  entries,
  locale,
}: DictionaryHeaderFilterProps) {
  const filterValue = column.getFilterValue() as string | undefined;
  const dictionary = dictionaries.find((d) => d.code === dictionaryCode);

  const options: FormOption[] = useMemo(() => {
    const dictionaryEntries = dictionary ? entries.filter((e) => e.dictionary_id === dictionary.id) : [];
    const allOption = { key: "all", label: capitalize("all") };
    const entryOptions = dictionaryEntries
      .map((entry) => ({
        key: entry.id.toString(),
        label: capitalize(getAvailableLocalizedText(entry.name, locale)),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return [allOption, ...entryOptions];
  }, [dictionary, entries, locale]);

  const selectedOption =
    options.find((opt) => {
      if (filterValue === undefined) return opt.key === "all";
      return opt.key === filterValue;
    }) || options[0];

  const selectOption = (option: FormOption) => {
    if (option.key === "all") {
      column.setFilterValue(undefined);
    } else {
      column.setFilterValue(option.key);
    }
  };

  return (
    <div className="absolute top-full left-0 z-10 mt-1 w-28" onClick={(e) => e.stopPropagation()}>
      <FormDropDown
        selectedOption={selectedOption}
        options={options}
        selectOption={selectOption}
        placeholder={capitalize("all")}
        className="hover:bg-muted/50 focus:bg-muted h-7 min-w-0 rounded-sm border-0 bg-transparent text-xs tracking-wide transition-colors"
      />
    </div>
  );
}
