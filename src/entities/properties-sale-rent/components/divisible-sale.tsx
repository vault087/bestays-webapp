import { PropertyOptionInput } from "./core/property-option-input";

export function PropertyDivisibleSale({ propertyId, locale }: { propertyId: string; locale: string }) {
  return (
    <PropertyOptionInput
      propertyId={propertyId}
      field="divisible_sale"
      dictionaryCode="divisible_sale_types"
      locale={locale}
    />
  );
}
