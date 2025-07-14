"use client";
import React, { memo } from "react";
import { Code } from "@/entities/dictionaries/types/dictionary.types";
import { useMultiCodeField } from "@/entities/properties/components/hooks/use-multi-code-field";
import { PropertyMultiCodeField } from "@/entities/properties-sale-rent/types/property.type";
import MultipleSelector, { Option } from "@/modules/shadcn/components/ui/multiselect";

export function PropertyHighlightsUncontrolledInput({ locale }: { locale: string }) {
  return <PropertyMultiCodeUncontrolledInput field="highlights" locale={locale} />;
}
export function PropertyLocationStrengthsUncontrolledInput({ locale }: { locale: string }) {
  return <PropertyMultiCodeUncontrolledInput field="location_strengths" locale={locale} />;
}
export function PropertyTransactionTypesUncontrolledInput({ locale }: { locale: string }) {
  return <PropertyMultiCodeUncontrolledInput field="transaction_types" locale={locale} />;
}
export function PropertyLandFeaturesUncontrolledInput({ locale }: { locale: string }) {
  return <PropertyMultiCodeUncontrolledInput field="land_features" locale={locale} />;
}
export function PropertyNearbyAttractionsUncontrolledInput({ locale }: { locale: string }) {
  return <PropertyMultiCodeUncontrolledInput field="nearby_attractions" locale={locale} />;
}
export function PropertyLandAndConstructionUncontrolledInput({ locale }: { locale: string }) {
  return <PropertyMultiCodeUncontrolledInput field="land_and_construction" locale={locale} />;
}

export const PropertyMultiCodeUncontrolledInput = memo(function PropertyMultiCodeUncontrolledInput({
  field,
  locale,
}: {
  field: PropertyMultiCodeField;
  locale: string;
}) {
  console.log("[RENDER] PropertyMultiCodeInput");
  const { inputId, currentValues, options, title, subtitle, setValues } = useMultiCodeField({
    field,
    locale,
    variant: "input",
  });

  return (
    <div className="*:not-first:mt-2">
      <p>{title}</p>
      <MultipleSelector
        inputProps={{
          id: inputId,
        }}
        commandProps={{
          label: title,
          filter: (value, search) => {
            const option = options.find((opt) => opt.code === value);
            if (!option) return 0;

            const searchLower = search.toLowerCase();
            return option.label.toLowerCase().includes(searchLower) ? 1 : 0;
          },
        }}
        defaultOptions={options
          .filter((option) => !currentValues.includes(option.code))
          .map((option) => ({
            value: option.code,
            label: option.label,
          }))}
        onChange={(value: Option[]) => {
          console.log("onChange", value);
          setValues(value.map((option) => option.value as Code));
        }}
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
});
