"use client";

import { CheckIcon, ChevronDownIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useDictionaryByCode } from "@/entities/dictionaries/stores/hooks/use-dictionary-store";
import { Code } from "@/entities/dictionaries/types/dictionary.types";
import {
  usePropertyOption,
  PropertyOptionField,
} from "@/entities/properties-sale-rent/hooks/utils/use-property-option";
import { Button } from "@/modules/shadcn/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/modules/shadcn/components/ui/command";
import { Label } from "@/modules/shadcn/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/shadcn/components/ui/popover";
import { cn } from "@/modules/shadcn/utils/cn";

export function PropertyOptionInput({
  propertyId,
  field,
  dictionaryCode,
  locale,
}: {
  propertyId: string;
  field: PropertyOptionField;
  dictionaryCode: Code;
  locale: string;
}) {
  const dictionary = useDictionaryByCode(dictionaryCode);

  const { inputId, selected, setSelected, options } = usePropertyOption(
    propertyId,
    locale,
    field,
    dictionary,
    "option-input",
  );
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={inputId}>{dictionary?.name?.[locale] || dictionaryCode}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={inputId}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
          >
            <span className={cn("truncate", !selected && "text-muted-foreground")}>
              {selected ? selected.label : "Select option"}
            </span>
            <ChevronDownIcon size={16} className="text-muted-foreground/80 shrink-0" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0" align="start">
          <Command>
            <CommandInput placeholder="Find option" />
            <CommandList>
              <CommandEmpty>Not found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.code}
                    value={option.label}
                    onSelect={() => {
                      setSelected(option.code);
                      setOpen(false);
                    }}
                  >
                    {option.label}
                    {selected?.code === option.code && <CheckIcon size={16} className="ml-auto" />}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <Button variant="ghost" className="w-full justify-start font-normal">
                  <PlusIcon size={16} className="-ms-2 opacity-60" aria-hidden="true" />
                  New option
                </Button>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <p className="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
        {dictionary?.description?.[locale] || ""}
      </p>
    </div>
  );
}
