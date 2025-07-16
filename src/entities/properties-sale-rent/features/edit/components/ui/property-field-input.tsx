import { useTranslations } from "next-intl";
import { PropertyLocalizedTextUncontrolledInput } from "./core/localized-text-uncontrolled-input";
import { MultiCodeUncontrolledCheckbox } from "./core/multi-code-uncontrolled-checkbox";
import { MultiCodeUncontrolledInput } from "./core/multi-code-uncontrolled-input";
import { SingleCodeUncontrolledInput } from "./core/single-code-uncontrolled-input";
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
  return <MultiCodeUncontrolledCheckbox field="highlights" />;
}
export function PropertyLocationStrengthsCheckbox() {
  return <MultiCodeUncontrolledCheckbox field="location_strengths" />;
}
export function PropertyTransactionTypesCheckbox() {
  return <MultiCodeUncontrolledCheckbox field="transaction_types" />;
}
export function PropertyLandFeaturesCheckbox() {
  return <MultiCodeUncontrolledCheckbox field="land_features" />;
}
export function PropertyNearbyAttractionsCheckbox() {
  return <MultiCodeUncontrolledCheckbox field="nearby_attractions" />;
}
export function PropertyLandAndConstructionCheckbox() {
  return <MultiCodeUncontrolledCheckbox field="land_and_construction" />;
}

// Multi Code Uncontrolled Input
export function PropertyHighlightsInput() {
  return <MultiCodeUncontrolledInput field="highlights" />;
}
export function PropertyLocationStrengthsInput() {
  return <MultiCodeUncontrolledInput field="location_strengths" />;
}
export function PropertyTransactionTypesInput() {
  return <MultiCodeUncontrolledInput field="transaction_types" />;
}
export function PropertyLandFeaturesInput() {
  return <MultiCodeUncontrolledInput field="land_features" />;
}
export function PropertyNearbyAttractionsInput() {
  return <MultiCodeUncontrolledInput field="nearby_attractions" />;
}
export function PropertyLandAndConstructionInput() {
  return <MultiCodeUncontrolledInput field="land_and_construction" />;
}

// Single CodeUncontrolled Input
export function PropertyAreaInput() {
  return <SingleCodeUncontrolledInput field="area" />;
}
export function PropertyDivisibleSaleInput() {
  return <SingleCodeUncontrolledInput field="divisible_sale" />;
}
export function PropertyOwnershipTypeInput() {
  return <SingleCodeUncontrolledInput field="ownership_type" />;
}
export function PropertyPropertyTypeInput() {
  return <SingleCodeUncontrolledInput field="property_type" />;
}
