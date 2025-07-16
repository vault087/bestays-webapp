"use client";
import {
  DBPropertyMultiCodeField,
  useMultiCodeField,
  MultiCodeOption,
  PropertyFieldHeader,
  PropertyFieldFooter,
} from "@/entities/properties-sale-rent/";
import { Checkbox, Label } from "@/modules/shadcn/";
import { useDebugRender } from "@/utils/use-debug-render";

export function PropertyHighlightsUncontrolledCheckbox() {
  return <MultiCodeUncontrolledCheckbox field="highlights" />;
}
export function PropertyLocationStrengthsUncontrolledCheckbox() {
  return <MultiCodeUncontrolledCheckbox field="location_strengths" />;
}
export function PropertyTransactionTypesUncontrolledCheckbox() {
  return <MultiCodeUncontrolledCheckbox field="transaction_types" />;
}
export function PropertyLandFeaturesUncontrolledCheckbox() {
  return <MultiCodeUncontrolledCheckbox field="land_features" />;
}
export function PropertyNearbyAttractionsUncontrolledCheckbox() {
  return <MultiCodeUncontrolledCheckbox field="nearby_attractions" />;
}
export function PropertyLandAndConstructionUncontrolledCheckbox() {
  return <MultiCodeUncontrolledCheckbox field="land_and_construction" />;
}

function MultiCodeUncontrolledCheckbox({ field }: { field: DBPropertyMultiCodeField }) {
  const { currentValues, options, title, subtitle, toggleValue } = useMultiCodeField({
    field,
    variant: "checkbox",
  });
  useDebugRender("Checkbox" + title);

  return (
    <div className="*:not-first:mt-2">
      <PropertyFieldHeader text={title} />
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
      <PropertyFieldFooter text={subtitle} />
    </div>
  );
}
