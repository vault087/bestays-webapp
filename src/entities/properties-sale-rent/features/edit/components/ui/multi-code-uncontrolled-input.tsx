"use client";
import { useCallback, useMemo } from "react";
import { Code } from "@/entities/dictionaries/types/dictionary.types";
import { DBPropertyMultiCodeField } from "@/entities/properties-sale-rent/";
import { useMultiCodeField } from "@/entities/properties-sale-rent/features/edit/components/hooks/use-multi-code-field";
import MultipleSelector, { Option } from "@/modules/shadcn/components/ui/multiselect";
import { useDebugRender } from "@/utils/use-debug-render";

export function PropertyHighlightsUncontrolledInput({ locale }: { locale: string }) {
  return <MultiCodeUncontrolledInput field="highlights" locale={locale} />;
}
export function PropertyLocationStrengthsUncontrolledInput({ locale }: { locale: string }) {
  return <MultiCodeUncontrolledInput field="location_strengths" locale={locale} />;
}
export function PropertyTransactionTypesUncontrolledInput({ locale }: { locale: string }) {
  return <MultiCodeUncontrolledInput field="transaction_types" locale={locale} />;
}
export function PropertyLandFeaturesUncontrolledInput({ locale }: { locale: string }) {
  return <MultiCodeUncontrolledInput field="land_features" locale={locale} />;
}
export function PropertyNearbyAttractionsUncontrolledInput({ locale }: { locale: string }) {
  return <MultiCodeUncontrolledInput field="nearby_attractions" locale={locale} />;
}
export function PropertyLandAndConstructionUncontrolledInput({ locale }: { locale: string }) {
  return <MultiCodeUncontrolledInput field="land_and_construction" locale={locale} />;
}

const MultiCodeUncontrolledInput = function MultiCodeUncontrolledInput({
  field,
  locale,
}: {
  field: DBPropertyMultiCodeField;
  locale: string;
}) {
  const { inputId, currentValues, options, title, subtitle, setValues } = useMultiCodeField({
    field,
    locale,
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
