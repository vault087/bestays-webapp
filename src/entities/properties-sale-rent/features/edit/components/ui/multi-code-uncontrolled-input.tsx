"use client";
import { useCallback, useMemo } from "react";
import { Code } from "@/entities/dictionaries/types/dictionary.types";
import { DBPropertyMultiCodeField, useMultiCodeField } from "@/entities/properties-sale-rent/";
import MultipleSelector, { Option } from "@/modules/shadcn/components/ui/multiselect";
import { useDebugRender } from "@/utils/use-debug-render";

export function PropertyHighlightsUncontrolledInput() {
  return <MultiCodeUncontrolledInput field="highlights" />;
}
export function PropertyLocationStrengthsUncontrolledInput() {
  return <MultiCodeUncontrolledInput field="location_strengths" />;
}
export function PropertyTransactionTypesUncontrolledInput() {
  return <MultiCodeUncontrolledInput field="transaction_types" />;
}
export function PropertyLandFeaturesUncontrolledInput() {
  return <MultiCodeUncontrolledInput field="land_features" />;
}
export function PropertyNearbyAttractionsUncontrolledInput() {
  return <MultiCodeUncontrolledInput field="nearby_attractions" />;
}
export function PropertyLandAndConstructionUncontrolledInput() {
  return <MultiCodeUncontrolledInput field="land_and_construction" />;
}

const MultiCodeUncontrolledInput = function MultiCodeUncontrolledInput({ field }: { field: DBPropertyMultiCodeField }) {
  const { inputId, currentValues, options, title, subtitle, setValues } = useMultiCodeField({
    field,
    variant: "input",
  });

  // Create lookup map once
  const optionsMap = useMemo(() => new Map(options.map((opt) => [opt.code, opt.label])), [options]);

  const convertedValues: Option[] = useMemo(() => {
    return currentValues.map((code) => ({
      value: code,
      label: optionsMap.get(code) || "",
    }));
  }, [currentValues, optionsMap]);

  const convertedOptions: Option[] = useMemo(() => {
    return options.map((option) => ({
      value: option.code,
      label: option.label,
    }));
  }, [options]);

  const handleFilter = useCallback(
    (value: string, search: string) => {
      const option = options.find((opt) => opt.code === value);
      if (!option) return 0;

      const searchLower = search.toLowerCase();
      return option.label.toLowerCase().includes(searchLower) ? 1 : 0;
    },
    [options],
  );

  const handleOnChange = useCallback(
    (value: Option[]) => {
      setValues(value.map((option) => option.value as Code));
    },
    [setValues],
  );

  useDebugRender("MultiInput" + title);
  return (
    <div className="*:not-first:mt-2">
      <p>{title}</p>
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
      <p className="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
        {subtitle}
      </p>
    </div>
  );
};
