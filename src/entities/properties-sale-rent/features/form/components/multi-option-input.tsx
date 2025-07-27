"use client";

import { memo, useMemo, useState } from "react";
import { FormFieldLayout } from "@/components/form";
import { FormMultiOption, FormMultiOptionVariant } from "@/components/form/inputs/form-multi-option-input";
import { FormFieldLayoutToolbar } from "@/components/form/layout/form-field-layout-toolbar";
import {
  DBPropertyMultiCodeField,
  PropertyLocaleProvider,
  usePropertyLocale,
  useMultiOptionField,
} from "@/entities/properties-sale-rent/";
// import { FieldDropDownMenu } from "./option-input";
import { CustomLocaleSwitcher } from "./custom-locale-switcher";

export type MultiOptionFieldProps = {
  className?: string;
  variant?: FormMultiOptionVariant | undefined;
};

export function PropertyHighlightsInput({ className, variant }: MultiOptionFieldProps) {
  return <MultiOptionFieldLocalized variant={variant} field="highlights" className={className} />;
}
export function PropertyLocationStrengthsInput({ className, variant }: MultiOptionFieldProps) {
  return <MultiOptionFieldLocalized variant={variant} field="location_strengths" className={className} />;
}
export function PropertyLandFeaturesInput({ className, variant }: MultiOptionFieldProps) {
  return <MultiOptionFieldLocalized variant={variant} field="land_features" className={className} />;
}
export function PropertyNearbyAttractionsInput({ className, variant }: MultiOptionFieldProps) {
  return <MultiOptionFieldLocalized variant={variant} field="nearby_attractions" className={className} />;
}
export function PropertyLandAndConstructionInput({ className, variant }: MultiOptionFieldProps) {
  return <MultiOptionFieldLocalized variant={variant} field="land_and_construction" className={className} />;
}

const MultiOptionFieldLocalized = memo(function MultiOptionFieldLocalized({
  field,
  className,
  variant = "checkbox",
}: {
  field: DBPropertyMultiCodeField;
  className?: string;
  variant?: FormMultiOptionVariant | undefined;
}) {
  const locale = usePropertyLocale();
  const [customLocale, setCustomLocale] = useState(locale);

  const toolbar = useMemo(
    () => (
      <FormFieldLayoutToolbar>
        <CustomLocaleSwitcher locale={locale} customLocale={customLocale} setCustomLocale={setCustomLocale} />{" "}
      </FormFieldLayoutToolbar>
    ),
    [locale, customLocale, setCustomLocale],
  );

  return (
    <PropertyLocaleProvider locale={customLocale}>
      <MultiOptionField field={field} className={className} variant={variant} toolbar={toolbar} />
    </PropertyLocaleProvider>
  );
});

function MultiOptionField({
  field,
  variant = "checkbox",
  className,
  toolbar,
}: {
  field: DBPropertyMultiCodeField;
  className?: string;
  variant?: FormMultiOptionVariant | undefined;
  toolbar?: React.ReactNode;
}) {
  const {
    inputId,
    selectedOptions,
    options,
    title,
    description,
    selectOptions,
    toggleOption,
    addOption,
    error,
    isAddingOption,
  } = useMultiOptionField({ field });

  return (
    <FormFieldLayout
      title={title}
      description={description}
      error={error}
      className={className}
      config={{ focus_ring: true }}
    >
      {toolbar}
      <FormMultiOption
        isAddingOption={isAddingOption}
        title={title}
        inputId={inputId}
        selectedOptions={selectedOptions}
        options={options}
        toggleOption={toggleOption}
        selectOptions={selectOptions}
        variant={variant}
        addOption={addOption}
      />
    </FormFieldLayout>
  );
}
