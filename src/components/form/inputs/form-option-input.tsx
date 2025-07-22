"use client";

import { CheckIcon, ChevronDownIcon, PlusIcon } from "lucide-react";
import { useState, memo } from "react";
import { FormSingleOptionProps } from "@/components/form";
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

export type FormOptionVariant = "select";

export type FormOptionState = FormSingleOptionProps & {
  inputId: string;
};

export const FormOptionInput = memo(function FormOptionInput({
  inputId,
  selectedOption,
  options,
  selectOption,
  addOption,
  variant,
}: FormOptionState & { variant?: FormOptionVariant }) {
  return (
    <>
      {variant === "select" && (
        <FormOptionSelect
          inputId={inputId}
          selectedOption={selectedOption}
          options={options}
          selectOption={selectOption}
          addOption={addOption}
        />
      )}
    </>
  );
});

export const FormOptionSelect = memo(function FormOptionInput({
  inputId,
  selectedOption,
  options,
  selectOption,
  addOption,
}: FormOptionState) {
  const [open, setOpen] = useState<boolean>(false);

  return (
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
            {addOption && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <Button variant="ghost" className="w-full justify-start font-normal" onClick={addOption.onClick}>
                    <PlusIcon size={16} className="-ms-2 opacity-60" aria-hidden="true" />
                    {addOption.label}
                  </Button>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});
