"use client";
import { useCallback, useMemo } from "react";
import {
  DBPropertyMultiCodeField,
  PropertyFieldDecription,
  PropertyFieldHeader,
  useMultiOptionField,
} from "@/entities/properties-sale-rent/";
import MultipleSelector, { Option } from "@/modules/shadcn/components/ui/multiselect";
import { useDebugRender } from "@/utils/use-debug-render";

// Multi Code Uncontrolled Input
export function PropertyHighlightsInput() {
  return <MultiOptionInput field="highlights" />;
}
export function PropertyLocationStrengthsInput() {
  return <MultiOptionInput field="location_strengths" />;
}
export function PropertyTransactionTypesInput() {
  return <MultiOptionInput field="transaction_types" />;
}
export function PropertyLandFeaturesInput() {
  return <MultiOptionInput field="land_features" />;
}
export function PropertyNearbyAttractionsInput() {
  return <MultiOptionInput field="nearby_attractions" />;
}
export function PropertyLandAndConstructionInput() {
  return <MultiOptionInput field="land_and_construction" />;
}

export const MultiOptionInput = function MultiOptionInput({ field }: { field: DBPropertyMultiCodeField }) {
  const { inputId, currentValues, options, title, subtitle, setValues } = useMultiOptionField({
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
      <PropertyFieldDecription text={subtitle} inputId={inputId} />
    </div>
  );
};
