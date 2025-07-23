"use client";

import { FormFieldLayout, FormOptionInput, FormOptionVariant } from "@/components/form";
import { DBPropertyCodeField } from "@/entities/properties-sale-rent/";
import { useOptionField } from "@/entities/properties-sale-rent/features/form/hooks/use-option-field";

export type OptionFieldProps = {
  className?: string;
  variant?: FormOptionVariant | undefined;
};
// Single CodeUncontrolled Input
export function PropertyAreaInput({ className, variant }: OptionFieldProps) {
  return <PropertyOptionField variant={variant} field="area" className={className} />;
}
export function PropertyDivisibleSaleInput({ className, variant }: OptionFieldProps) {
  return <PropertyOptionField variant={variant} field="divisible_sale" className={className} />;
}
export function PropertyOwnershipTypeInput({ className, variant }: OptionFieldProps) {
  return <PropertyOptionField variant={variant} field="ownership_type" className={className} />;
}
export function PropertyPropertyTypeInput({ className, variant }: OptionFieldProps) {
  return <PropertyOptionField variant={variant} field="property_type" className={className} />;
}

export function PropertyOptionField({
  field,
  className,
  variant = "select",
}: OptionFieldProps & { field: DBPropertyCodeField }) {
  const { inputId, selectedOption, options, title, description, selectOption, error, addOption } = useOptionField({
    field,
  });

  return (
    <FormFieldLayout
      title={title}
      description={description}
      error={error}
      className={className}
      config={{ focus_ring: true }}
    >
      <FormOptionInput
        inputId={inputId}
        selectedOption={selectedOption}
        options={options}
        selectOption={selectOption}
        variant={variant}
        addOption={addOption}
      />
    </FormFieldLayout>
  );
}
