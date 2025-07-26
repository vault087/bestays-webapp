"use client";

import { PlusIcon } from "lucide-react";
import { useMemo, useCallback, memo, useRef, useState } from "react";
import { FormMultiOptionProps, FormOption } from "@/components/form/types";
import { cn } from "@/modules/shadcn";
import { Button, Checkbox, Input, Label } from "@/modules/shadcn/components";
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
  isAddingOption,
  selectedOptions,
  options,
  toggleOption,
  selectOptions,
  addOption,
  variant,
}: FormMultiOptionState & { variant: FormMultiOptionVariant }) {
  console.log("addOption", addOption);
  return (
    <>
      {variant === "checkbox" && (
        <FormMultiOptionCheckbox
          isAddingOption={isAddingOption}
          selectOptions={selectOptions}
          inputId={inputId}
          selectedOptions={selectedOptions}
          options={options}
          toggleOption={toggleOption}
          title={title}
          addOption={addOption}
        />
      )}
      {variant === "select" && (
        <FormMultiOptionSelect
          inputId={inputId}
          toggleOption={toggleOption}
          isAddingOption={isAddingOption}
          title={title}
          selectedOptions={selectedOptions}
          options={options}
          selectOptions={selectOptions}
          addOption={addOption}
        />
      )}
    </>
  );
});

// Color palette optimized for human vision and accessibility
function FormMultiOptionCheckbox({ inputId, selectedOptions, options, toggleOption, addOption }: FormMultiOptionState) {
  const selectedKeys = selectedOptions?.map((option) => option.key);

  const [addValueText, setAddValueText] = useState("");

  const addOptionRef = useRef<HTMLInputElement | null>(null);
  const handleAddOption = useCallback(() => {
    addOption?.onClick(addOptionRef.current?.value);
    if (addOptionRef.current) {
      addOptionRef.current.value = "";
    }
  }, [addOption]);

  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((option: FormOption) => (
        <div
          className={cn(
            "flex flex-row items-center justify-between gap-2 space-x-0 rounded-md px-3 py-3",
            selectedKeys?.includes(option.key) ? "border-primary border-1 shadow-sm" : "border-border border-1",
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
            <Label htmlFor={`${inputId}-${option.key}`}>{option.label}</Label>
          </div>
          <Checkbox
            id={`${inputId}-${option.key}`}
            checked={selectedKeys?.includes(option.key)}
            onCheckedChange={(selected) => {
              toggleOption(option, selected as boolean);
            }}
            className="rounded-full"
          />
        </div>
      ))}
      {addOption && (
        <div className="focus-within:border-primary flex flex-row items-center justify-between gap-2 rounded-md border-1 ps-3 pe-1 focus-within:shadow-sm">
          <Input
            id={`${inputId}-add-option`}
            ref={addOptionRef}
            onChange={(e) => setAddValueText(e.target.value)}
            placeholder="Add New"
            className="roudned-none border-0 shadow-none"
          />
          <Button variant="ghost" size="icon" disabled={addValueText.length < 2} onClick={() => handleAddOption()}>
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
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
