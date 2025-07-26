"use client";

import { ChevronDownIcon, CheckIcon } from "lucide-react";
import { memo, useCallback } from "react";
import { SortIcon, type SortDirection } from "@/components/ui/sort-icon";
import { DBDictionary, DBDictionaryEntry } from "@/entities/dictionaries";
import { getAvailableLocalizedText } from "@/entities/localized-text/utils/get-available-localized-text";
import {
  TABLE_FIELDS_CONFIG,
  VISIBLE_FIELDS,
  GRID_TEMPLATE_COLUMNS,
  type SortableFieldKey,
  type TableFieldKey,
  type FilterableFieldKey,
} from "@/entities/properties-sale-rent/features/listing/types/table-fields.types";
import { PropertyFieldToDictionaryCodeMap } from "@/entities/properties-sale-rent/types/property-fields.types";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/modules/shadcn";
import { cn } from "@/modules/shadcn/utils/cn";
import { capitalize } from "@/utils/capitalize";

interface FormOption {
  key: string;
  label: string;
}

interface CustomTableHeaderProps {
  sorting: Array<{ id: string; desc: boolean }>;
  setSorting: (sorting: Array<{ id: string; desc: boolean }>) => void;
  columnFilters: Array<{ id: string; value: unknown }>;
  setColumnFilters: (
    filters:
      | Array<{ id: string; value: unknown }>
      | ((prev: Array<{ id: string; value: unknown }>) => Array<{ id: string; value: unknown }>),
  ) => void;
  dictionaries: DBDictionary[];
  entries: DBDictionaryEntry[];
  locale: string;
}

export const CustomTableHeader = memo(function CustomTableHeader({
  sorting,
  setSorting,
  columnFilters,
  setColumnFilters,
  dictionaries,
  entries,
  locale,
}: CustomTableHeaderProps) {
  const getSortDirection = useCallback(
    (fieldKey: TableFieldKey): SortDirection => {
      const sortItem = sorting.find((item) => item.id === fieldKey);
      if (!sortItem) return "off";
      return sortItem.desc ? "desc" : "asc";
    },
    [sorting],
  );

  const getFilterValue = useCallback(
    (fieldKey: FilterableFieldKey): string | boolean | undefined => {
      const filter = columnFilters.find((f) => f.id === fieldKey);
      return filter?.value as string | boolean | undefined;
    },
    [columnFilters],
  );

  const handleSort = useCallback(
    (fieldKey: SortableFieldKey) => {
      const currentSort = getSortDirection(fieldKey);

      if (currentSort === "asc") {
        setSorting([{ id: fieldKey, desc: true }]);
      } else if (currentSort === "desc") {
        setSorting([{ id: fieldKey, desc: false }]);
      } else {
        setSorting([{ id: fieldKey, desc: true }]);
      }
    },
    [getSortDirection, setSorting],
  );

  const setFilterValue = useCallback(
    (fieldKey: FilterableFieldKey, value: string | boolean | undefined) => {
      setColumnFilters((prev) => {
        if (value === undefined) {
          return prev.filter((f) => f.id !== fieldKey);
        }

        const existingIndex = prev.findIndex((f) => f.id === fieldKey);
        if (existingIndex >= 0) {
          const newFilters = [...prev];
          newFilters[existingIndex] = { id: fieldKey, value };
          return newFilters;
        } else {
          return [...prev, { id: fieldKey, value }];
        }
      });
    },
    [setColumnFilters],
  );

  // const renderSortIcon = useCallback(
  //   (fieldKey: TableFieldKey) => {
  //     const sortDirection = getSortDirection(fieldKey);
  //     const iconSize = "h-4 w-4";

  //     if (sortDirection === "asc") {
  //       return <ArrowUp className={cn(iconSize, "opacity-60 transition-opacity hover:opacity-100")} />;
  //     } else if (sortDirection === "desc") {
  //       return <ArrowDown className={cn(iconSize, "opacity-60 transition-opacity hover:opacity-100")} />;
  //     } else {
  //       return <ArrowUpDown className={cn(iconSize, "opacity-60 transition-opacity hover:opacity-100")} />;
  //     }
  //   },
  //   [getSortDirection],
  // );

  // Dictionary filter component
  const DictionaryHeaderFilter = useCallback(
    ({ fieldKey, dictionaryCode }: { fieldKey: FilterableFieldKey; dictionaryCode: string }) => {
      const filterValue = getFilterValue(fieldKey);
      const dictionary = dictionaries.find((d) => d.code === dictionaryCode);

      const dictionaryEntries = dictionary ? entries.filter((e) => e.dictionary_id === dictionary.id) : [];
      const allOption = { key: "all", label: capitalize("all") };
      const entryOptions = dictionaryEntries
        .map((entry) => ({
          key: entry.id.toString(),
          label: capitalize(getAvailableLocalizedText(entry.name, locale)),
        }))
        .sort((a, b) => a.label.localeCompare(b.label));

      const options: FormOption[] = [allOption, ...entryOptions];

      const selectedOption =
        options.find((opt) => {
          if (filterValue === undefined) return opt.key === "all";
          return opt.key === filterValue;
        }) || options[0];

      const selectOption = (option: FormOption) => {
        if (option.key === "all") {
          setFilterValue(fieldKey, undefined);
        } else {
          setFilterValue(fieldKey, option.key);
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex h-full w-full flex-col items-center justify-center space-y-2">
              {/* <Button
                variant="ghost"
                className="hover:bg-muted/90 focus:bg-muted space-x-2 rounded-sm border-0 bg-transparent text-sm font-medium tracking-wide"
              >
                <div className="flex h-full w-full items-center justify-center space-x-2"> */}
              <span>{TABLE_FIELDS_CONFIG[fieldKey].label}</span>
              {/* <ChevronDownIcon className="size-4" />
                </div>
              </Button> */}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[180px]">
            {options.map((option) => (
              <DropdownMenuItem key={option.key} onClick={() => selectOption(option)} className="flex justify-between">
                <span className="text-muted-foreground text-sm uppercase">{option.label}</span>
                {option?.key === selectedOption?.key && <CheckIcon size={16} className="ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    [dictionaries, entries, locale, getFilterValue, setFilterValue],
  );

  // Boolean filter component
  const BooleanHeaderFilter = useCallback(
    ({ fieldKey }: { fieldKey: FilterableFieldKey }) => {
      const filterValue = getFilterValue(fieldKey);

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
          setFilterValue(fieldKey, undefined);
        } else {
          setFilterValue(fieldKey, option.key === "true");
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex h-full w-full items-center justify-center space-x-0">
              <Button
                variant="ghost"
                className="hover:bg-muted/90 focus:bg-muted space-x-2 rounded-sm border-0 bg-transparent text-sm font-medium tracking-wide"
              >
                <div className="flex h-full w-full items-center justify-center space-x-2">
                  <span>{TABLE_FIELDS_CONFIG[fieldKey].label}</span>
                  <ChevronDownIcon className="size-4" />
                </div>
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[180px]">
            {options.map((option) => (
              <DropdownMenuItem key={option.key} onClick={() => selectOption(option)} className="flex justify-between">
                <span className="text-muted-foreground text-sm uppercase">{option.label}</span>
                {option?.key === selectedOption?.key && <CheckIcon size={16} className="ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    [getFilterValue, setFilterValue],
  );

  const renderHeaderCell = useCallback(
    (fieldKey: TableFieldKey) => {
      const config = TABLE_FIELDS_CONFIG[fieldKey];

      // Empty cell for cover_image
      if (fieldKey === "cover_image") {
        return (
          <div key={fieldKey} className={cn(config.headerClassName)}>
            {/* Empty cell for image column */}
          </div>
        );
      }

      // Filterable fields - entire cell triggers dropdown
      if (config.filterable) {
        switch (fieldKey) {
          case "property_type":
            return (
              <div key={fieldKey} className={cn(config.headerClassName)}>
                <DictionaryHeaderFilter
                  fieldKey={fieldKey}
                  dictionaryCode={PropertyFieldToDictionaryCodeMap.property_type}
                />
              </div>
            );
          case "area":
            return (
              <div key={fieldKey} className={cn(config.headerClassName, "")}>
                <DictionaryHeaderFilter fieldKey={fieldKey} dictionaryCode={PropertyFieldToDictionaryCodeMap.area} />
              </div>
            );
          case "is_published":
          case "sale_enabled":
          case "rent_enabled":
            return (
              <div key={fieldKey} className={cn(config.headerClassName)}>
                <BooleanHeaderFilter fieldKey={fieldKey as FilterableFieldKey} />
              </div>
            );
          default:
            return null;
        }
      }

      // Sortable-only fields - title + separate sort button
      // if (config.sortable) {
      //   return (
      //     <div key={fieldKey} className={cn(config.headerClassName)}>
      //       <div className="flex h-12 items-center justify-between">
      //         <span className="text-sm font-medium tracking-wide">{config.label}</span>
      //         <button
      //           className="hover:bg-muted/30 ml-2 rounded p-1 transition-colors"
      //           onClick={(e) => {
      //             e.stopPropagation();
      //             handleSort(fieldKey as SortableFieldKey);
      //           }}
      //         >
      //           {renderSortIcon(fieldKey)}
      //         </button>
      //       </div>
      //     </div>
      //   );
      // }

      // Sortable fields - title + sort icon
      if (config.sortable) {
        return (
          <div
            key={fieldKey}
            className={cn(config.headerClassName, "cursor-pointer")}
            onClick={() => handleSort(fieldKey as SortableFieldKey)}
          >
            <div className="flex h-12 items-center justify-center gap-2">
              <span className="text-center text-sm font-medium tracking-wide text-gray-700">{config.label}</span>
              <SortIcon direction={getSortDirection(fieldKey)} />
            </div>
          </div>
        );
      }

      // Non-sortable, non-filterable fields
      return (
        <div key={fieldKey} className={cn(config.headerClassName, "flex items-center justify-center")}>
          <span className="text-sm font-medium text-gray-700">{config.label}</span>
        </div>
      );
    },
    [DictionaryHeaderFilter, BooleanHeaderFilter, handleSort, getSortDirection],
  );

  return (
    <div
      className="border-b border-gray-200 bg-gray-50"
      style={{
        display: "grid",
        gridTemplateColumns: GRID_TEMPLATE_COLUMNS,
      }}
    >
      {VISIBLE_FIELDS.map(renderHeaderCell)}
    </div>
  );
});
