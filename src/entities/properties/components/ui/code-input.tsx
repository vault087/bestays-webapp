"use client";

import { CheckIcon, ChevronDownIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useCodeField } from "@/entities/properties/components/hooks/use-code-field";
import { PropertyCodeField } from "@/entities/properties-sale-rent/types/property.type";
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

export function PropertyAreaInput({ locale }: { locale: string }) {
  return <PropertyFieldCodeInput field="area" locale={locale} />;
}
export function PropertyDivisibleSaleInput({ locale }: { locale: string }) {
  return <PropertyFieldCodeInput field="divisible_sale" locale={locale} />;
}
export function PropertyOwnershipTypeInput({ locale }: { locale: string }) {
  return <PropertyFieldCodeInput field="ownership_type" locale={locale} />;
}
export function PropertyPropertyTypeInput({ locale }: { locale: string }) {
  return <PropertyFieldCodeInput field="property_type" locale={locale} />;
}

export function PropertyFieldCodeInput({ field, locale }: { field: PropertyCodeField; locale: string }) {
  console.log("[RENDER] PropertyMultiCodeInput");
  const { inputId, initialValue, options, title, subtitle, setValue } = useCodeField({
    field,
    locale,
    variant: "input",
  });

  const [open, setOpen] = useState<boolean>(false);

  console.log("[RENDER] PropertyOptionInput");

  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={inputId}>{title}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={inputId}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
          >
            <span className={cn("truncate", !initialValue && "text-muted-foreground")}>
              {initialValue ? initialValue.label : "Select option"}
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
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      setValue(option.value);
                      setOpen(false);
                    }}
                  >
                    {option.label}
                    {initialValue?.value === option.value && <CheckIcon size={16} className="ml-auto" />}
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
        {subtitle}
      </p>
    </div>
  );
}
