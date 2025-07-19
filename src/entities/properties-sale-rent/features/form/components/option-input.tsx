"use client";

import { CheckIcon, ChevronDownIcon, PlusIcon } from "lucide-react";
import { useState, useRef } from "react";
import { DBPropertyCodeField, PropertyFieldDecription, PropertyFieldHeader } from "@/entities/properties-sale-rent/";
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
  const { inputId, currentValue, options, title, subtitle, setValue } = useOptionField({
    field,
    variant: "input",
  });

  const [open, setOpen] = useState<boolean>(false);

  useDebugRender("Input" + title);

  // ✅ EFFICIENT - Stable callback, current data
  const optionsRef = useRef(options);
  optionsRef.current = options; // Always current

  return (
    <div className="flex flex-col space-y-2">
      <PropertyFieldHeader text={title} inputId={inputId} />
      <div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={inputId}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
            >
              <span className={cn("truncate", !currentValue && "text-muted-foreground")}>
                {currentValue ? currentValue.label : "Select option"}
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
                        setValue(option.key);
                        setOpen(false);
                      }}
                    >
                      {option.label}
                      {currentValue?.key === option.key && <CheckIcon size={16} className="ml-auto" />}
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
      </div>
      <PropertyFieldDecription text={subtitle} inputId={inputId} />
    </div>
  );
}
