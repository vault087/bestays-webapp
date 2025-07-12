import { PropertyOptionInput } from "./single-option/property-option";

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
