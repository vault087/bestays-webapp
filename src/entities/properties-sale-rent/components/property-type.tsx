import { PropertyOptionInput } from "./core/property-option-input";

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
