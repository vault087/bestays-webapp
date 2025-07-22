"use client";

import { useMemo, useCallback, memo } from "react";
import { FormMultiOptionProps, FormOption } from "@/components/form/types";
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

function FormMultiOptionCheckbox({ inputId, selectedOptions, options, toggleOption }: FormMultiOptionState) {
  const selectedKeys = selectedOptions?.map((option) => option.key);
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((option: FormOption) => (
        <div className="flex items-center gap-2" key={option.key}>
          <Checkbox
            id={`${inputId}-${option.key}`}
            checked={selectedKeys?.includes(option.key)}
            onCheckedChange={(selected) => {
              toggleOption(option, selected as boolean);
            }}
          />
          <Label
            htmlFor={`${inputId}-${option.key}`}
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
            {option.label}
          </Label>
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
