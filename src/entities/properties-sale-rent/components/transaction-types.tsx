import { PropertyMultiOptionInput } from "./multi-options/property-multi-option-input";

export function PropertyTransactionTypes({ propertyId, locale }: { propertyId: string; locale: string }) {
  return (
    <PropertyMultiOptionInput
      propertyId={propertyId}
      field="transaction_types"
      dictionaryCode="transaction_types"
      locale={locale}
    />
  );
}
