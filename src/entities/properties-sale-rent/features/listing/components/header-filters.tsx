"use client";

import { Column } from "@tanstack/react-table";
import { useMemo } from "react";
import { FormDropDown } from "@/components/form/inputs/form-dropdown";
import { FormOption } from "@/components/form/types/form-option";
import { DBDictionary, DBDictionaryEntry } from "@/entities/dictionaries";
import { getAvailableLocalizedText } from "@/entities/localized-text/utils/get-available-localized-text";
import { PropertyRow } from "./types";

interface BooleanHeaderFilterProps {
  column: Column<PropertyRow, unknown>;
}

export function BooleanHeaderFilter({ column }: BooleanHeaderFilterProps) {
  const filterValue = column.getFilterValue() as boolean | undefined;

  const options: FormOption[] = [
    { key: "all", label: "All" },
    { key: "true", label: "Yes" },
    { key: "false", label: "No" },
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
    <div className="mt-1 w-20" onClick={(e) => e.stopPropagation()}>
      <FormDropDown
        selectedOption={selectedOption}
        options={options}
        selectOption={selectOption}
        placeholder="All"
        className="h-8 min-w-0 text-xs"
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
    const allOption = { key: "all", label: "All" };
    const entryOptions = dictionaryEntries
      .map((entry) => ({
        key: entry.id.toString(),
        label: getAvailableLocalizedText(entry.name, locale),
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
    <div className="mt-1 w-32" onClick={(e) => e.stopPropagation()}>
      <FormDropDown
        selectedOption={selectedOption}
        options={options}
        selectOption={selectOption}
        placeholder="All"
        className="h-8 min-w-0 text-xs"
      />
    </div>
  );
}
