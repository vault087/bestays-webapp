"use client";

import { CheckIcon, ChevronDownIcon, PlusIcon } from "lucide-react";
import { useState, useRef } from "react";
import { FormFieldLayout } from "@/components/form";
import { DBPropertyCodeField } from "@/entities/properties-sale-rent/";
import { useOptionField } from "@/entities/properties-sale-rent/features/form/hooks/use-option-field";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/shadcn/components/ui/popover";
import { cn } from "@/modules/shadcn/utils/cn";
import { useDebugRender } from "@/utils/use-debug-render";

// Single CodeUncontrolled Input
export function PropertyAreaInput() {
  return <OptionInput field="area" />;
}
export function PropertyDivisibleSaleInput() {
  return <OptionInput field="divisible_sale" />;
}
export function PropertyOwnershipTypeInput() {
  return <OptionInput field="ownership_type" />;
}
export function PropertyPropertyTypeInput() {
  return <OptionInput field="property_type" />;
}

export function OptionInput({ field }: { field: DBPropertyCodeField }) {
  const { inputId, selectedOption, options, title, subtitle, selectOption, error } = useOptionField({ field });

  const [open, setOpen] = useState<boolean>(false);

  useDebugRender("Input" + title);

  // ✅ EFFICIENT - Stable callback, current data
  const optionsRef = useRef(options);
  optionsRef.current = options; // Always current

  return (
    <FormFieldLayout inputId={inputId} title={title} description={subtitle} error={error}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={inputId}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
          >
            <span className={cn("truncate", !selectedOption && "text-muted-foreground")}>
              {selectedOption ? selectedOption.label : "Select option"}
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
                    key={option.key}
                    value={option.label}
                    onSelect={() => {
                      selectOption(option);
                      setOpen(false);
                    }}
                  >
                    {option.label}
                    {selectedOption?.key === option.key && <CheckIcon size={16} className="ml-auto" />}
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
    </FormFieldLayout>
  );
}
