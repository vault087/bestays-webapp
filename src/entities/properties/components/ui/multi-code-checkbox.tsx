"use client";
import React, { memo } from "react";
import { useMultiCodeField, MultiCodeOption } from "@/entities/properties/components/hooks/use-multi-code-field";
import { PropertyMultiCodeField } from "@/entities/properties-sale-rent/types/property.type";
import { Checkbox } from "@/modules/shadcn/components/ui/checkbox";
import { Label } from "@/modules/shadcn/components/ui/label";

export function PropertyHighlightsCheckbox({ locale }: { locale: string }) {
  return <PropertyFieldMultiCodeCheckbox field="highlights" locale={locale} />;
}
export function PropertyLocationStrengthsCheckbox({ locale }: { locale: string }) {
  return <PropertyFieldMultiCodeCheckbox field="location_strengths" locale={locale} />;
}
export function PropertyTransactionTypesCheckbox({ locale }: { locale: string }) {
  return <PropertyFieldMultiCodeCheckbox field="transaction_types" locale={locale} />;
}
export function PropertyLandFeaturesCheckbox({ locale }: { locale: string }) {
  return <PropertyFieldMultiCodeCheckbox field="land_features" locale={locale} />;
}
export function PropertyNearbyAttractionsCheckbox({ locale }: { locale: string }) {
  return <PropertyFieldMultiCodeCheckbox field="nearby_attractions" locale={locale} />;
}
export function PropertyLandAndConstructionCheckbox({ locale }: { locale: string }) {
  return <PropertyFieldMultiCodeCheckbox field="land_and_construction" locale={locale} />;
}

export const PropertyFieldMultiCodeCheckbox = memo(function PropertyFieldMultiCodeCheckbox({
  field,
  locale,
}: {
  field: PropertyMultiCodeField;
  locale: string;
}) {
  console.log("[RENDER] PropertyFieldMultiCodeCheckbox");
  const { inputId, initialValues, options, title, subtitle, toggleValue } = useMultiCodeField({
    field,
    locale,
    variant: "checkbox",
  });

  return (
    <div className="*:not-first:mt-2">
      <p>{title}</p>
      {options.map((option: MultiCodeOption) => (
        <div className="flex items-center gap-2" key={option.value}>
          <Checkbox
            id={inputId}
            defaultChecked={initialValues.includes(option.value || "")}
            onCheckedChange={(checked) => {
              toggleValue(option.value, checked as boolean);
            }}
          />
          <Label htmlFor={inputId}>{option.label}</Label>
        </div>
      ))}
      <p className="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
        {subtitle}
      </p>
    </div>
  );
});
