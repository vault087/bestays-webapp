import { PropertyMultiOptionInput } from "./core/property-multi-option-input";

export function PropertyLandAndConstruction({ propertyId, locale }: { propertyId: string; locale: string }) {
  return (
    <PropertyMultiOptionInput
      propertyId={propertyId}
      field="land_and_construction"
      dictionaryCode="land_and_construction"
      locale={locale}
    />
  );
}
