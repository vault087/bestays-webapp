"use client";

import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { DBDictionary } from "@/entities/dictionaries";
import { getAvailableLocalizedText } from "@/entities/localized-text/utils/get-available-localized-text";
import { Input } from "@/modules/shadcn/components/ui/input";

interface EditorSearchBarProps {
  dictionary: DBDictionary;
  locale: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFocus: () => void;
  onBlur: () => void;
}

export const EditorSearchBar = memo(
  ({ dictionary, locale, searchQuery, onSearchChange, onFocus, onBlur }: EditorSearchBarProps) => {
    const tCommon = useTranslations("Common");

    return (
      <div className="border-input flex items-center border-b px-5" cmdk-input-wrapper="">
        <SearchIcon size={20} className="text-muted-foreground/80 me-3" />
        <Input
          data-slot="command-input-wrapper"
          className="placeholder:text-muted-foreground/70 flex h-10 w-full rounded-md border-0 bg-transparent py-3 text-sm shadow-none outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={tCommon("option.find_value", {
            value: getAvailableLocalizedText(dictionary.name, locale).toLocaleLowerCase(),
          })}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>
    );
  },
);

EditorSearchBar.displayName = "EditorSearchBar";
