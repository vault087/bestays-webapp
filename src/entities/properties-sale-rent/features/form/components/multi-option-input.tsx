"use client";
import { useCallback, useMemo } from "react";
import { FormFieldLayout, FormOption } from "@/components/form";
import { DBPropertyMultiCodeField, useMultiOptionField } from "@/entities/properties-sale-rent/";
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
  const { inputId, selectedOptions, options, title, subtitle, selectOptions, error } = useMultiOptionField({ field });

  // Convert options to MultipleSelector format
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

  useDebugRender("MultiInput" + title);

  return (
    <FormFieldLayout title={title} description={subtitle} error={error}>
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
    </FormFieldLayout>
  );
};
