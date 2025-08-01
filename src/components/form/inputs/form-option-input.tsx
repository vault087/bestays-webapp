"use client";

import { CheckIcon, ChevronDownIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, memo, useRef, useMemo, useCallback } from "react";
import { FormSingleOptionProps } from "@/components/form";
import { useFormFieldLayout } from "@/components/form/layout";
import { Button } from "@/modules/shadcn/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
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
  isAddingOption,
  selectOption,
  addOption,
  variant,
}: FormOptionState & { variant?: FormOptionVariant }) {
  return (
    <>
      {variant === "select" && (
        <FormOptionSelect
          inputId={inputId}
          isAddingOption={isAddingOption}
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
  isAddingOption,
  selectOption,
  addOption,
}: FormOptionState) {
  const [open, setOpen] = useState<boolean>(false);
  const t = useTranslations("Common");

  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState<string>(""); // ← Add state for input value

  const { setFocused } = useFormFieldLayout();

  const handleAddOption = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setInputValue("");
      addOption?.onClick(inputValue);
      setOpen(false);
      setFocused(false);
    },
    [addOption, inputValue, setFocused],
  );

  const isExactMatching = useMemo(() => {
    return options.some((option) => option.label.toLowerCase() === inputValue.toLowerCase().trim());
  }, [options, inputValue]);

  const isAddButtonEnabled = inputValue.trim().length > 1 && !isExactMatching && !isAddingOption;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={inputId}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="hover:bg-background border-input justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
        >
          <span className={cn("truncate", !selectedOption && "text-muted-foreground")}>
            {selectedOption ? selectedOption.label : "Select option"}
          </span>
          <ChevronDownIcon size={16} className="text-muted-foreground/80 shrink-0" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0" align="start">
        <Command>
          <CommandInput
            placeholder={t("option.find_or_enter_value", { value: addOption?.label || "" })}
            ref={inputRef}
            onValueChange={setInputValue}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          {addOption && inputValue.length > 0 && (
            <div className="text-muted-foreground flex w-full flex-col items-start justify-start space-y-1">
              <div className="flex pt-2 pl-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start font-normal"
                  onMouseDown={(e) => {
                    // Prevent focus loss during state updates
                    e.preventDefault();
                  }}
                  onClick={handleAddOption}
                  disabled={!isAddButtonEnabled}
                >
                  <div className="flex items-center justify-center gap-2 space-x-0 px-2">
                    <PlusIcon size={16} className="-ms-2 opacity-60" aria-hidden="true" />
                    <span className={cn("text-sm", isAddButtonEnabled && "rounded-b-none border-b-1")}>
                      {inputValue.length > 0
                        ? t("option.add.preview_value", { value: inputValue })
                        : t("option.add.placeholder")}
                    </span>
                  </div>
                </Button>
              </div>
            </div>
          )}

          <CommandList>
            <CommandEmpty className="flex w-full items-start justify-center pb-3">
              <div className="flex flex-col items-start justify-center gap-2">
                <span className="text-muted-foreground text-sm">{t("not_found")}</span>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.key}
                  value={option.label}
                  onMouseDown={(e) => {
                    // Prevent focus loss during state updates
                    e.preventDefault();
                  }}
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
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});
