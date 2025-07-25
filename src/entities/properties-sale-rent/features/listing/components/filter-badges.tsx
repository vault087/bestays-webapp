import { ColumnFiltersState } from "@tanstack/react-table";
import { X } from "lucide-react";
import { memo } from "react";
import { DBDictionaryEntry } from "@/entities/dictionaries";
import { getAvailableLocalizedText } from "@/entities/localized-text/utils/get-available-localized-text";
import { Button } from "@/modules/shadcn";
import { cn } from "@/modules/shadcn/utils/cn";
import { capitalize } from "@/utils/capitalize";

interface FilterBadgesProps {
  columnFilters: ColumnFiltersState;
  setColumnFilters: (filters: ColumnFiltersState | ((prev: ColumnFiltersState) => ColumnFiltersState)) => void;
  entries: DBDictionaryEntry[];
  locale: string;
}

export const FilterBadges = memo(function FilterBadges({
  columnFilters,
  setColumnFilters,
  entries,
  locale,
}: FilterBadgesProps) {
  if (columnFilters.length === 0) return null;

  const removeFilter = (columnId: string) => {
    setColumnFilters((prev) => prev.filter((filter) => filter.id !== columnId));
  };

  const getFilterDisplayValue = (filter: { id: string; value: string | boolean | number }) => {
    // Handle boolean filters
    if (typeof filter.value === "boolean") {
      return filter.value ? "Yes" : "No";
    }

    // Handle dictionary filters
    if (typeof filter.value === "string" && filter.value !== "all") {
      const entry = entries.find((e) => e.id.toString() === filter.value);
      if (entry) {
        return capitalize(getAvailableLocalizedText(entry.name, locale));
      }
    }

    return filter.value?.toString() || "";
  };

  return (
    <div className="bg-muted/20 flex flex-wrap gap-1 border-b px-4 py-2 text-xs">
      {columnFilters.map((filter) => {
        const displayValue = getFilterDisplayValue(filter as { id: string; value: string | boolean | number });
        if (!displayValue) return null;

        return (
          <div
            key={filter.id}
            className={cn(
              "inline-flex items-center gap-1 px-2 py-1",
              "text-muted-foreground text-xs",
              "border-muted-foreground/30 border-b",
              "rounded-b-none bg-transparent",
            )}
          >
            <span>{displayValue}</span>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-muted-foreground/10 h-3 w-3 p-0"
              onClick={() => removeFilter(filter.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        );
      })}
    </div>
  );
});
