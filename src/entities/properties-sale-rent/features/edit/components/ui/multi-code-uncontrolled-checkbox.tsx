"use client";
import { DBPropertyMultiCodeField, useMultiCodeField, MultiCodeOption } from "@/entities/properties-sale-rent/";
import { Checkbox, Label } from "@/modules/shadcn/";
import { useDebugRender } from "@/utils/use-debug-render";

export function PropertyHighlightsUncontrolledCheckbox({ locale }: { locale: string }) {
  return <MultiCodeUncontrolledCheckbox field="highlights" locale={locale} />;
}
export function PropertyLocationStrengthsUncontrolledCheckbox({ locale }: { locale: string }) {
  return <MultiCodeUncontrolledCheckbox field="location_strengths" locale={locale} />;
}
export function PropertyTransactionTypesUncontrolledCheckbox({ locale }: { locale: string }) {
  return <MultiCodeUncontrolledCheckbox field="transaction_types" locale={locale} />;
}
export function PropertyLandFeaturesUncontrolledCheckbox({ locale }: { locale: string }) {
  return <MultiCodeUncontrolledCheckbox field="land_features" locale={locale} />;
}
export function PropertyNearbyAttractionsUncontrolledCheckbox({ locale }: { locale: string }) {
  return <MultiCodeUncontrolledCheckbox field="nearby_attractions" locale={locale} />;
}
export function PropertyLandAndConstructionUncontrolledCheckbox({ locale }: { locale: string }) {
  return <MultiCodeUncontrolledCheckbox field="land_and_construction" locale={locale} />;
}

function MultiCodeUncontrolledCheckbox({ field, locale }: { field: DBPropertyMultiCodeField; locale: string }) {
  const { currentValues, options, title, subtitle, toggleValue } = useMultiCodeField({
    field,
    locale,
    variant: "checkbox",
  });
  useDebugRender("Checkbox" + title);

  return (
    <div className="*:not-first:mt-2">
      <p>{title}</p>
      {options.map((option: MultiCodeOption) => (
        <div className="flex items-center gap-2" key={option.code}>
          <Checkbox
            id={option.inputId}
            checked={currentValues.includes(option.code || "")}
            onCheckedChange={(checked) => {
              toggleValue(option.code, checked as boolean);
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
}
