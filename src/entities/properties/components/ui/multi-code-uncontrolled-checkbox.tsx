"use client";
import React, { memo } from "react";
import { useMultiCodeField, MultiCodeOption } from "@/entities/properties/components/hooks/use-multi-code-field";
import { PropertyMultiCodeField } from "@/entities/properties-sale-rent/types/property.type";
import { Checkbox } from "@/modules/shadcn/components/ui/checkbox";
import { Label } from "@/modules/shadcn/components/ui/label";

export function PropertyHighlightsUncontrolledCheckbox({ locale }: { locale: string }) {
  return <PropertyMultiCodeUncontrolledCheckbox field="highlights" locale={locale} />;
}
export function PropertyLocationStrengthsUncontrolledCheckbox({ locale }: { locale: string }) {
  return <PropertyMultiCodeUncontrolledCheckbox field="location_strengths" locale={locale} />;
}
export function PropertyTransactionTypesUncontrolledCheckbox({ locale }: { locale: string }) {
  return <PropertyMultiCodeUncontrolledCheckbox field="transaction_types" locale={locale} />;
}
export function PropertyLandFeaturesUncontrolledCheckbox({ locale }: { locale: string }) {
  return <PropertyMultiCodeUncontrolledCheckbox field="land_features" locale={locale} />;
}
export function PropertyNearbyAttractionsUncontrolledCheckbox({ locale }: { locale: string }) {
  return <PropertyMultiCodeUncontrolledCheckbox field="nearby_attractions" locale={locale} />;
}
export function PropertyLandAndConstructionUncontrolledCheckbox({ locale }: { locale: string }) {
  return <PropertyMultiCodeUncontrolledCheckbox field="land_and_construction" locale={locale} />;
}

export const PropertyMultiCodeUncontrolledCheckbox = memo(function PropertyMultiCodeUncontrolledCheckbox({
  field,
  locale,
}: {
  field: PropertyMultiCodeField;
  locale: string;
}) {
  console.log("[RENDER] PropertyFieldMultiCodeCheckbox");
  const { currentValues, options, title, subtitle, toggleValue } = useMultiCodeField({
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
            id={option.inputId}
            checked={currentValues.includes(option.value || "")}
            onCheckedChange={(checked) => {
              toggleValue(option.value, checked as boolean);
            }}
          />
          <Label htmlFor={option.inputId}>{option.label}</Label>
        </div>
      ))}
      <p className="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
        {subtitle}
      </p>
    </div>
  );
});
