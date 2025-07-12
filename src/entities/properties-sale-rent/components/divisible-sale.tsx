import { PropertyOptionInput } from "./single-option/property-option";

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
