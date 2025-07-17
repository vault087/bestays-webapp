import { useTranslations } from "next-intl";
import { PropertyLocalizedTextUncontrolledInput } from "./core/localized-text-uncontrolled-input";
import { MultiOptionUncontrolledCheckbox } from "./core/multi-option-uncontrolled-checkbox";
import { MultiOptionUncontrolledInput } from "./core/multi-option-uncontrolled-input";
import { OptionUncontrolledInput } from "./core/option-uncontrolled-input";
import { PropertyTextUncontrolledInput } from "./core/text-uncontrolled-input";

// Localized Text Uncontrolled Input
export const PropertyAboutInput = function PropertyAboutInput() {
  const t = useTranslations("PropertiesSaleRent.fields.about");
  return (
    <PropertyLocalizedTextUncontrolledInput
      title={t("label")}
      placeholder={t("placeholder")}
      subtitle={t("subtitle")}
      field="about"
    />
  );
};

// Text Uncontrolled Input
export const PropertyAgentNotesInput = function PropertyAgentNotesInput() {
  const t = useTranslations("PropertiesSaleRent.fields");
  const title = t("agent_notes.label");
  const subtitle = t("agent_notes.subtitle");
  const placeholder = t("agent_notes.placeholder");
  return (
    <PropertyTextUncontrolledInput title={title} placeholder={placeholder} subtitle={subtitle} field="agent_notes" />
  );
};

// Multi Code Uncontrolled Checkbox
export function PropertyHighlightsCheckbox() {
  return <MultiOptionUncontrolledCheckbox field="highlights" />;
}
export function PropertyLocationStrengthsCheckbox() {
  return <MultiOptionUncontrolledCheckbox field="location_strengths" />;
}
export function PropertyTransactionTypesCheckbox() {
  return <MultiOptionUncontrolledCheckbox field="transaction_types" />;
}
export function PropertyLandFeaturesCheckbox() {
  return <MultiOptionUncontrolledCheckbox field="land_features" />;
}
export function PropertyNearbyAttractionsCheckbox() {
  return <MultiOptionUncontrolledCheckbox field="nearby_attractions" />;
}
export function PropertyLandAndConstructionCheckbox() {
  return <MultiOptionUncontrolledCheckbox field="land_and_construction" />;
}

// Multi Code Uncontrolled Input
export function PropertyHighlightsInput() {
  return <MultiOptionUncontrolledInput field="highlights" />;
}
export function PropertyLocationStrengthsInput() {
  return <MultiOptionUncontrolledInput field="location_strengths" />;
}
export function PropertyTransactionTypesInput() {
  return <MultiOptionUncontrolledInput field="transaction_types" />;
}
export function PropertyLandFeaturesInput() {
  return <MultiOptionUncontrolledInput field="land_features" />;
}
export function PropertyNearbyAttractionsInput() {
  return <MultiOptionUncontrolledInput field="nearby_attractions" />;
}
export function PropertyLandAndConstructionInput() {
  return <MultiOptionUncontrolledInput field="land_and_construction" />;
}

// Single CodeUncontrolled Input
export function PropertyAreaInput() {
  return <OptionUncontrolledInput field="area" />;
}
export function PropertyDivisibleSaleInput() {
  return <OptionUncontrolledInput field="divisible_sale" />;
}
export function PropertyOwnershipTypeInput() {
  return <OptionUncontrolledInput field="ownership_type" />;
}
export function PropertyPropertyTypeInput() {
  return <OptionUncontrolledInput field="property_type" />;
}
