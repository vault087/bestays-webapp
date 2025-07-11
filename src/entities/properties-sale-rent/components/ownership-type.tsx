import { PropertyOptionInput } from "./core/property-option-input";

export function PropertyOwnershipType({ propertyId, locale }: { propertyId: string; locale: string }) {
  return (
    <PropertyOptionInput
      propertyId={propertyId}
      field="ownership_type"
      dictionaryCode="ownership_types"
      locale={locale}
    />
  );
}
