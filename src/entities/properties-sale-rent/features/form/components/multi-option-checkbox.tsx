"use client";
import { FormFieldLayout, FormOption } from "@/components/form";
import { DBPropertyMultiCodeField, useMultiOptionField } from "@/entities/properties-sale-rent/";
import { Checkbox, Label } from "@/modules/shadcn/";
import { useDebugRender } from "@/utils/use-debug-render";

// Multi Code Uncontrolled Checkbox
export function PropertyHighlightsCheckbox({ className }: { className?: string }) {
  return <MultiOptionCheckbox field="highlights" className={className} />;
}
export function PropertyLocationStrengthsCheckbox({ className }: { className?: string }) {
  return <MultiOptionCheckbox field="location_strengths" className={className} />;
}
export function PropertyTransactionTypesCheckbox({ className }: { className?: string }) {
  return <MultiOptionCheckbox field="transaction_types" className={className} />;
}
export function PropertyLandFeaturesCheckbox({ className }: { className?: string }) {
  return <MultiOptionCheckbox field="land_features" className={className} />;
}
export function PropertyNearbyAttractionsCheckbox({ className }: { className?: string }) {
  return <MultiOptionCheckbox field="nearby_attractions" className={className} />;
}
export function PropertyLandAndConstructionCheckbox({ className }: { className?: string }) {
  return <MultiOptionCheckbox field="land_and_construction" className={className} />;
}

export function MultiOptionCheckbox({ field, className }: { field: DBPropertyMultiCodeField; className?: string }) {
  const { inputId, selectedOptions, options, title, subtitle, toggleOption, error } = useMultiOptionField({ field });
  useDebugRender("Checkbox " + title);

  const selectedKeys = selectedOptions?.map((option) => option.key);
  return (
    <FormFieldLayout title={title} description={subtitle} error={error} className={className}>
      <div className="grid grid-cols-2 gap-2 rounded-sm border-1 p-4 shadow-xs">
        {options.map((option: FormOption) => (
          <div className="flex items-center gap-2" key={option.key}>
            <Checkbox
              id={`${inputId}-${option.key}`}
              checked={selectedKeys?.includes(option.key)}
              onCheckedChange={(selected) => {
                toggleOption(option, selected as boolean);
              }}
            />
            <Label htmlFor={`${inputId}-${option.key}`}>{option.label}</Label>
          </div>
        ))}
      </div>
    </FormFieldLayout>
  );
}
