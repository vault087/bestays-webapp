import { PropertyMultiOptionInput } from "./multi-options/property-multi-option-input";

export function PropertyNearbyAttractions({ propertyId, locale }: { propertyId: string; locale: string }) {
  return (
    <PropertyMultiOptionInput
      propertyId={propertyId}
      field="nearby_attractions"
      dictionaryCode="nearby_attractions"
      locale={locale}
    />
  );
}
