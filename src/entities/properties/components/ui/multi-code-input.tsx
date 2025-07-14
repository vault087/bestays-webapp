"use client";
import React, { memo } from "react";
import { Code } from "@/entities/dictionaries/types/dictionary.types";
import { useMultiCodeField } from "@/entities/properties/components/hooks/use-multi-code-field";
import { PropertyMultiCodeField } from "@/entities/properties-sale-rent/types/property.type";
import MultipleSelector from "@/modules/shadcn/components/ui/multiselect";

export const PropertyHighlightsInput = (locale: string) => {
  return <PropertyFieldMultiCodeInput field="highlights" locale={locale} />;
};
export const PropertyLocationStrengthsInput = (locale: string) => {
  return <PropertyFieldMultiCodeInput field="location_strengths" locale={locale} />;
};
export const PropertyTransactionTypesInput = (locale: string) => {
  return <PropertyFieldMultiCodeInput field="transaction_types" locale={locale} />;
};
export const PropertyLandFeaturesInput = (locale: string) => {
  return <PropertyFieldMultiCodeInput field="land_features" locale={locale} />;
};
export const PropertyNearbyAttractionsInput = (locale: string) => {
  return <PropertyFieldMultiCodeInput field="nearby_attractions" locale={locale} />;
};
export const PropertyLandAndConstructionInput = (locale: string) => {
  return <PropertyFieldMultiCodeInput field="land_and_construction" locale={locale} />;
};

export const PropertyFieldMultiCodeInput = memo(function PropertyFieldMultiCodeInput({
  field,
  locale,
}: {
  field: PropertyMultiCodeField;
  locale: string;
}) {
  console.log("[RENDER] PropertyMultiCodeInput");
  const { inputId, initialValues, options, title, subtitle, setValues } = useMultiCodeField({
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
            const option = options.find((opt) => opt.value === value);
            if (!option) return 0;

            const searchLower = search.toLowerCase();
            return option.label.toLowerCase().includes(searchLower) ? 1 : 0;
          },
        }}
        defaultOptions={options
          .filter((option) => !initialValues.includes(option.value))
          .map((option) => ({
            value: option.value,
            label: option.label,
          }))}
        onChange={(value) => {
          setValues(value.map((option) => option.key as Code));
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
