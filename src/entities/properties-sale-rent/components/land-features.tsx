import { PropertyMultiOptionInput } from "./core/property-multi-option-input";

export function PropertyLandFeatures({ propertyId, locale }: { propertyId: string; locale: string }) {
  return (
    <PropertyMultiOptionInput
      propertyId={propertyId}
      field="land_features"
      dictionaryCode="land_features"
      locale={locale}
    />
  );
}
