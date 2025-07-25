"use client";
import { Column } from "@tanstack/react-table";
import { CheckIcon, ChevronDown } from "lucide-react";
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
    <FilterDropDown
      title={title}
      selectedOption={selectedOption}
      options={options}
      selectOption={selectOption}
      placeholder={capitalize("all")}
      className="hover:bg-muted/50 focus:bg-muted h-12 min-w-0 rounded-sm border-0 bg-transparent text-xs tracking-wide transition-all duration-200 ease-in-out"
    />
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
    <FilterDropDown
      title={title}
      selectedOption={selectedOption}
      options={options}
      selectOption={selectOption}
      placeholder={capitalize("all")}
      className="hover:bg-muted/50 focus:bg-muted h-12 min-w-0 rounded-sm border-0 bg-transparent text-xs tracking-wide transition-all duration-200 ease-in-out"
    />
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
        {title ? (
          <Button
            variant="ghost"
            className={cn(
              "hover:bg-muted/50 focus:bg-muted flex items-center justify-between space-x-2 text-sm font-medium tracking-wide",
              className,
            )}
          >
            <span>{title}</span>
            <ChevronDown className="size-4" />
          </Button>
        ) : (
          <Button variant="text" className={cn("flex flex-row items-center justify-center space-x-0", className)}>
            {selectedOption && <span className="px-0 text-sm uppercase">{selectedOption.label}</span>}
            {!selectedOption && placeholder && <span className="px-0 text-sm uppercase">{placeholder}</span>}
            {options.length > 1 && <ChevronDown className="size-4" />}
          </Button>
        )}
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
  children: React.ReactNode;
}

export function HeaderDropdown({ children }: HeaderDropdownProps) {
  return <div className="relative flex h-full w-full">{children}</div>;
}
