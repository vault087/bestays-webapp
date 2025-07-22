"use client";
import { FormFieldLayout } from "@/components/form";
import { FormMultiOption, FormMultiOptionVariant } from "@/components/form/inputs/form-multi-option-input";
import { DBPropertyMultiCodeField, useMultiOptionField } from "@/entities/properties-sale-rent/";

export type MultiOptionFieldProps = {
  className?: string;
  variant?: FormMultiOptionVariant | undefined;
};

export function PropertyHighlightsInput({ className, variant }: MultiOptionFieldProps) {
  return <MultiOptionField variant={variant} field="highlights" className={className} />;
}
export function PropertyLocationStrengthsInput({ className, variant }: MultiOptionFieldProps) {
  return <MultiOptionField variant={variant} field="location_strengths" className={className} />;
}
export function PropertyTransactionTypesInput({ className, variant }: MultiOptionFieldProps) {
  return <MultiOptionField variant={variant} field="transaction_types" className={className} />;
}
export function PropertyLandFeaturesInput({ className, variant }: MultiOptionFieldProps) {
  return <MultiOptionField variant={variant} field="land_features" className={className} />;
}
export function PropertyNearbyAttractionsInput({ className, variant }: MultiOptionFieldProps) {
  return <MultiOptionField variant={variant} field="nearby_attractions" className={className} />;
}
export function PropertyLandAndConstructionInput({ className, variant }: MultiOptionFieldProps) {
  return <MultiOptionField variant={variant} field="land_and_construction" className={className} />;
}

function MultiOptionField({
  field,
  variant = "checkbox",
  className,
}: {
  field: DBPropertyMultiCodeField;
  className?: string;
  variant?: FormMultiOptionVariant | undefined;
}) {
  const { inputId, selectedOptions, options, title, subtitle, selectOptions, toggleOption, addOption, error } =
    useMultiOptionField({ field });

  return (
    <FormFieldLayout
      title={title}
      description={subtitle}
      error={error}
      className={className}
      config={{ focus_ring: true }}
    >
      <FormMultiOption
        title={title}
        inputId={inputId}
        selectedOptions={selectedOptions}
        options={options}
        toggleOption={toggleOption}
        selectOptions={selectOptions}
        variant={variant}
        addOption={field === "transaction_types" ? undefined : addOption}
      />
    </FormFieldLayout>
  );
}
