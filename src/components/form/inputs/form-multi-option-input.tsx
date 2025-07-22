"use client";

import { useMemo, useCallback, memo } from "react";
import { FormMultiOptionProps, FormOption } from "@/components/form/types";
import { cn } from "@/modules/shadcn";
import { Checkbox, Label } from "@/modules/shadcn/components";
import MultipleSelector, { Option } from "@/modules/shadcn/components/ui/multiselect";

export type FormMultiOptionState = FormMultiOptionProps & {
  inputId: string;
  title: string | undefined;
  error?: string | undefined;
};
export type FormMultiOptionVariant = "select" | "checkbox";
export const FormMultiOption = memo(function FormMultiOption({
  inputId,
  title,
  selectedOptions,
  options,
  toggleOption,
  selectOptions,
  variant,
}: FormMultiOptionState & { variant: FormMultiOptionVariant }) {
  return (
    <>
      {variant === "checkbox" && (
        <FormMultiOptionCheckbox
          selectOptions={selectOptions}
          inputId={inputId}
          selectedOptions={selectedOptions}
          options={options}
          toggleOption={toggleOption}
          title={title}
        />
      )}
      {variant === "select" && (
        <FormMultiOptionSelect
          inputId={inputId}
          toggleOption={toggleOption}
          title={title}
          selectedOptions={selectedOptions}
          options={options}
          selectOptions={selectOptions}
        />
      )}
    </>
  );
});

// Color palette optimized for human vision and accessibility
function FormMultiOptionCheckbox({ inputId, selectedOptions, options, toggleOption }: FormMultiOptionState) {
  const selectedKeys = selectedOptions?.map((option) => option.key);

  const optionSymbol = useCallback((label: string): string => {
    const words = label.split(" ");
    if (words.length === 0) {
      return "?";
    }
    if (words.length > 1) {
      return words[0].charAt(0) + words[1].charAt(0).toLowerCase();
    }
    if (label.length > 1) {
      return label.charAt(0) + label.charAt(1).toLowerCase();
    }

    return label.charAt(0).toUpperCase();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((option: FormOption) => (
        <div
          className={cn(
            "flex flex-row items-center justify-between gap-2 space-x-0 rounded-md border-1 p-3",
            selectedKeys?.includes(option.key) ? "border-primary" : "border-border",
          )}
          key={option.key}
          onMouseDown={(e) => {
            // Prevent focus loss during state updates
            e.preventDefault();
          }}
          onClick={(e) => {
            // Ensure the checkbox gets the click event properly
            e.preventDefault();
            const checkbox = document.getElementById(`${inputId}-${option.key}`) as HTMLInputElement;
            if (checkbox) {
              checkbox.click();
              checkbox.focus();
            }
          }}
        >
          <div className="flex flex-row items-center gap-2 space-x-1">
            {/* Icon */}
            <div
              className={cn(
                "p text-foreground flex h-8 w-8 items-center justify-center rounded-sm border-1 py-1",
                selectedKeys?.includes(option.key) && "text-primary border-primary",
                !selectedKeys?.includes(option.key) && "text-muted-foreground border-muted-foreground/40",
              )}
            >
              <span className="border-border min-w-8 text-center text-sm uppercase">{optionSymbol(option.label)}</span>
            </div>
            {/* Label */}
            <Label htmlFor={`${inputId}-${option.key}`}>{option.label}</Label>
          </div>
          <Checkbox
            id={`${inputId}-${option.key}`}
            checked={selectedKeys?.includes(option.key)}
            onCheckedChange={(selected) => {
              toggleOption(option, selected as boolean);
            }}
          />
        </div>
      ))}
    </div>
  );
}

function FormMultiOptionSelect({ inputId, title, selectedOptions, options, selectOptions }: FormMultiOptionState) {
  const convertedOptions: Option[] = useMemo(() => {
    return options.map((option) => ({
      value: String(option.key),
      label: option.label,
    }));
  }, [options]);

  // Convert selected options to MultipleSelector format
  const convertedValues: Option[] = useMemo(() => {
    return (
      selectedOptions?.map((option) => ({
        value: String(option.key),
        label: option.label,
      })) || []
    );
  }, [selectedOptions]);

  const handleFilter = useCallback(
    (value: string, search: string) => {
      const option = options.find((opt) => String(opt.key) === value);
      if (!option) return 0;

      const searchLower = search.toLowerCase();
      return option.label.toLowerCase().includes(searchLower) ? 1 : 0;
    },
    [options],
  );

  const handleOnChange = useCallback(
    (values: Option[]) => {
      // Find options that were added or removed
      const selectedOptions: FormOption[] = values.map((opt) => ({
        key: opt.value,
        label: opt.label,
      }));
      selectOptions(selectedOptions);
    },
    [selectOptions],
  );

  return (
    <MultipleSelector
      inputProps={{
        id: inputId,
      }}
      commandProps={{
        label: title,
        filter: handleFilter,
      }}
      value={convertedValues}
      options={convertedOptions}
      onChange={handleOnChange}
      placeholder={title}
      hideClearAllButton
      hidePlaceholderWhenSelected
      emptyIndicator={<p className="text-center text-sm">No results found</p>}
    />
  );
}
