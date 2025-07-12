import { PropertyOptionInput } from "./single-option/property-option";

export function PropertyType({ propertyId, locale }: { propertyId: string; locale: string }) {
  return (
    <PropertyOptionInput
      propertyId={propertyId}
      field="property_type"
      dictionaryCode="property_types"
      locale={locale}
    />
  );
}
