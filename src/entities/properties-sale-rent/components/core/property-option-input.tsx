"use client";

import { CheckIcon, ChevronDownIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { DBCode } from "@/entities/dictionaries/types/dictionary.types";
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
  dictionary,
  locale,
}: {
  propertyId: string;
  field: PropertyOptionField;
  dictionary: string;
  locale: string;
}) {
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
      <Label htmlFor={inputId}>Select with search and button</Label>
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
              {selected ? selected.label : "Select area type"}
            </span>
            <ChevronDownIcon size={16} className="text-muted-foreground/80 shrink-0" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0" align="start">
          <Command>
            <CommandInput placeholder="Find organization" />
            <CommandList>
              <CommandEmpty>No organization found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.code}
                    value={option.code}
                    onSelect={(currentValue) => {
                      setSelected(currentValue as DBCode);
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
                  New area type
                </Button>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
