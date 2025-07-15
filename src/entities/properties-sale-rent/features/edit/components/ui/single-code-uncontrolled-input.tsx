"use client";

import { CheckIcon, ChevronDownIcon, PlusIcon } from "lucide-react";
import { useState, useRef } from "react";
import { DBPropertyCodeField } from "@/entities/properties-sale-rent/";
import { useCodeField } from "@/entities/properties-sale-rent/features/edit/components/hooks/use-code-field";
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
import { useDebugRender } from "@/utils/use-debug-render";

export function PropertyAreaUncontrolledInput({ locale }: { locale: string }) {
  return <SingleCodeUncontrolledInput field="area" locale={locale} />;
}
export function PropertyDivisibleSaleUncontrolledInput({ locale }: { locale: string }) {
  return <SingleCodeUncontrolledInput field="divisible_sale" locale={locale} />;
}
export function PropertyOwnershipTypeUncontrolledInput({ locale }: { locale: string }) {
  return <SingleCodeUncontrolledInput field="ownership_type" locale={locale} />;
}
export function PropertyPropertyTypeUncontrolledInput({ locale }: { locale: string }) {
  return <SingleCodeUncontrolledInput field="property_type" locale={locale} />;
}

function SingleCodeUncontrolledInput({ field, locale }: { field: DBPropertyCodeField; locale: string }) {
  const { inputId, currentValue, options, title, subtitle, setValue } = useCodeField({
    field,
    locale,
    variant: "input",
  });

  const [open, setOpen] = useState<boolean>(false);

  useDebugRender("Input" + title);

  // ✅ EFFICIENT - Stable callback, current data
  const optionsRef = useRef(options);
  optionsRef.current = options; // Always current

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
                    key={option.code}
                    value={option.label}
                    onSelect={() => {
                      setValue(option.code);
                      setOpen(false);
                    }}
                  >
                    {option.label}
                    {currentValue?.code === option.code && <CheckIcon size={16} className="ml-auto" />}
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
