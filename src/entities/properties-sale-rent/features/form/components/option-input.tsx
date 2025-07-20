"use client";

import { FormFieldLayout, FormOptionInput } from "@/components/form";
import { DBPropertyCodeField } from "@/entities/properties-sale-rent/";
import { useOptionField } from "@/entities/properties-sale-rent/features/form/hooks/use-option-field";
import { useDebugRender } from "@/utils/use-debug-render";

// Single CodeUncontrolled Input
export function PropertyAreaInput({ className }: { className?: string }) {
  return <PropertyOptionInput field="area" className={className} />;
}
export function PropertyDivisibleSaleInput({ className }: { className?: string }) {
  return <PropertyOptionInput field="divisible_sale" className={className} />;
}
export function PropertyOwnershipTypeInput({ className }: { className?: string }) {
  return <PropertyOptionInput field="ownership_type" className={className} />;
}
export function PropertyPropertyTypeInput({ className }: { className?: string }) {
  return <PropertyOptionInput field="property_type" className={className} />;
}

export function PropertyOptionInput({ field, className }: { field: DBPropertyCodeField; className?: string }) {
  const { inputId, selectedOption, options, title, subtitle, selectOption, error } = useOptionField({ field });

  useDebugRender("PropertyOptionInput" + title);

  return (
    <FormFieldLayout inputId={inputId} title={title} description={subtitle} error={error} className={className}>
      <FormOptionInput
        inputId={inputId}
        selectedOption={selectedOption}
        options={options}
        selectOption={selectOption}
        title={title}
      />
    </FormFieldLayout>
  );
}
