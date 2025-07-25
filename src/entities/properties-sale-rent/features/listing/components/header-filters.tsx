"use client";
import { Column } from "@tanstack/react-table";
import { CheckIcon, ChevronDown, ChevronUp } from "lucide-react";
import { memo, useMemo } from "react";
import { FormSingleOptionProps } from "@/components/form/types";
import { FormOption } from "@/components/form/types/form-option";
import { DBDictionary, DBDictionaryEntry } from "@/entities/dictionaries";
import { getAvailableLocalizedText } from "@/entities/localized-text/utils/get-available-localized-text";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, Button } from "@/modules/shadcn";
import { cn } from "@/modules/shadcn/utils/cn";
import { capitalize } from "@/utils/capitalize";
import { PropertyRow } from "./types";

interface BooleanHeaderFilterProps {
  column: Column<PropertyRow, unknown>;
  title?: string;
}

export function BooleanHeaderFilter({ title, column }: BooleanHeaderFilterProps) {
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
    <div
      className="absolute left-0 z-10 mt-1 w-20 transition-all duration-200 ease-in-out"
      style={{ top: "50px" }}
      onClick={(e) => e.stopPropagation()}
    >
      <FilterDropDown
        title={title}
        selectedOption={selectedOption}
        options={options}
        selectOption={selectOption}
        placeholder={capitalize("all")}
        className="hover:bg-muted/50 focus:bg-muted h-7 min-w-0 rounded-sm border-0 bg-transparent text-xs tracking-wide transition-all duration-200 ease-in-out"
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
  title?: string;
}

export function DictionaryHeaderFilter({
  column,
  dictionaryCode,
  dictionaries,
  entries,
  locale,
  title,
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
    <div
      className="absolute left-0 z-10 mt-1 w-28 transition-all duration-200 ease-in-out"
      style={{ top: "50px" }}
      onClick={(e) => e.stopPropagation()}
    >
      <FilterDropDown
        title={title}
        selectedOption={selectedOption}
        options={options}
        selectOption={selectOption}
        placeholder={capitalize("all")}
        className="hover:bg-muted/50 focus:bg-muted h-7 min-w-0 rounded-sm border-0 bg-transparent text-xs tracking-wide transition-all duration-200 ease-in-out"
      />
    </div>
  );
}

export const FilterDropDown = memo(function FormDropDown({
  title,
  selectedOption,
  options,
  selectOption,
  placeholder,
  className,
}: FormSingleOptionProps & { title?: string; className?: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            "bg-background text-muted-foreground border-input inline-flex items-center rounded-md border",
            className,
          )}
        >
          {title && (
            <div className="flex flex-row items-center justify-center space-x-0">
              <span className="text-sm font-medium tracking-wide">{title}</span>
              <Button variant="ghost" size="icon">
                {JSON.stringify(selectedOption)}
                {selectedOption && <ChevronDown className="text-primary size-4" />}
                {!selectedOption && <ChevronUp className="text-muted-foreground size-4" />}
              </Button>
            </div>
          )}
          {!title && (
            <Button variant="text" className="flex flex-row items-center justify-center space-x-0">
              {selectedOption && <span className="px-0 text-sm uppercase">{selectedOption.label}</span>}
              {!selectedOption && placeholder && <span className="px-0 text-sm uppercase">{placeholder}</span>}
              {options.length > 1 && <ChevronDown className="size-4" />}
            </Button>
          )}
        </div>
      </DropdownMenuTrigger>
      {options.length > 1 && (
        <DropdownMenuContent className="min-w-(--radix-dropdown-menu-trigger-width)">
          {options.map((option) => (
            <div key={option.key}>
              <DropdownMenuItem onClick={() => selectOption(option)} className="flex justify-between">
                <span className="text-muted-foreground text-sm uppercase">{option.label}</span>
                {option?.key === selectedOption?.key && <CheckIcon size={16} className="ml-auto" />}
              </DropdownMenuItem>
            </div>
          ))}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
});

// Header Dropdown Component that shows column name with chevron
interface HeaderDropdownProps {
  title: string;
  hasFilter: boolean;
  children: React.ReactNode;
}

export function HeaderDropdown({ title, hasFilter, children }: HeaderDropdownProps) {
  return (
    <div className="relative">
      <div className="group hover:bg-muted/30 flex h-12 cursor-pointer items-center justify-between rounded-sm px-2 py-1 transition-all duration-200 ease-in-out">
        <span className="text-sm font-medium tracking-wide">{title}</span>
        <ChevronDown
          className={`h-4 w-4 transition-all duration-200 ease-in-out ${hasFilter ? "text-primary rotate-180" : "text-muted-foreground group-hover:text-foreground"}`}
        />
      </div>
      {children}
    </div>
  );
}
