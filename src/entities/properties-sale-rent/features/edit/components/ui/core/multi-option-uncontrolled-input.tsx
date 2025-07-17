"use client";
import { useCallback, useMemo } from "react";
import {
  DBPropertyMultiCodeField,
  PropertyFieldFooter,
  PropertyFieldHeader,
  useMultiCodeField,
} from "@/entities/properties-sale-rent/";
import MultipleSelector, { Option } from "@/modules/shadcn/components/ui/multiselect";
import { useDebugRender } from "@/utils/use-debug-render";

export const MultiOptionUncontrolledInput = function MultiOptionUncontrolledInput({
  field,
}: {
  field: DBPropertyMultiCodeField;
}) {
  const { inputId, currentValues, options, title, subtitle, setValues } = useMultiCodeField({
    field,
    variant: "input",
  });

  // Create lookup map once
  const optionsMap = useMemo(() => new Map(options.map((opt) => [opt.key, opt.label])), [options]);

  const convertedValues: Option[] = useMemo(() => {
    return currentValues.map((code) => ({
      value: String(code),
      label: optionsMap.get(code) || "",
    }));
  }, [currentValues, optionsMap]);

  const convertedOptions: Option[] = useMemo(() => {
    return options.map((option) => ({
      value: String(option.key),
      label: option.label,
    }));
  }, [options]);

  const handleFilter = useCallback(
    (value: string, search: string) => {
      const option = options.find((opt) => opt.key === Number(value));
      if (!option) return 0;

      const searchLower = search.toLowerCase();
      return option.label.toLowerCase().includes(searchLower) ? 1 : 0;
    },
    [options],
  );

  const handleOnChange = useCallback(
    (value: Option[]) => {
      setValues(value.map((option) => Number(option.value)));
    },
    [setValues],
  );

  useDebugRender("MultiInput" + title);
  return (
    <div className="*:not-first:mt-2">
      <PropertyFieldHeader text={title} inputId={inputId} />
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
      <PropertyFieldFooter text={subtitle} inputId={inputId} />
    </div>
  );
};
