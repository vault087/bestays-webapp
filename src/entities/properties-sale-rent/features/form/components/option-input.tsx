"use client";
import { memo, useMemo, useState } from "react";
import { FormFieldLayout, FormOptionInput, FormOptionVariant } from "@/components/form";
import { FormFieldLayoutToolbar } from "@/components/form/layout/form-field-layout-toolbar";
import { getAvailableLocalizedText } from "@/entities/localized-text";
import { DBPropertyCodeField, PropertyLocaleProvider, usePropertyLocale } from "@/entities/properties-sale-rent/";
import { useOptionField } from "@/entities/properties-sale-rent/features/form/hooks/use-option-field";
import { CustomLocaleSwitcher } from "./custom-locale-switcher";

export type OptionFieldProps = {
  className?: string;
  variant?: FormOptionVariant | undefined;
};
// Single CodeUncontrolled Input
export function PropertyAreaInput({ className, variant }: OptionFieldProps) {
  return <PropertyOptionFieldLocalized variant={variant} field="area" className={className} />;
}
export function PropertyDivisibleSaleInput({ className, variant }: OptionFieldProps) {
  return <PropertyOptionFieldLocalized variant={variant} field="divisible_sale" className={className} />;
}
export function PropertyOwnershipTypeInput({ className, variant }: OptionFieldProps) {
  return <PropertyOptionFieldLocalized variant={variant} field="ownership_type" className={className} />;
}
export function PropertyPropertyTypeInput({ className, variant }: OptionFieldProps) {
  return <PropertyOptionFieldLocalized variant={variant} field="property_type" className={className} />;
}

const PropertyOptionFieldLocalized = memo(function PropertyOptionFieldLocalized({
  field,
  className,
  variant = "select",
}: OptionFieldProps & { field: DBPropertyCodeField }) {
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
      <PropertyOptionField field={field} className={className} variant={variant} toolbar={toolbar} />
    </PropertyLocaleProvider>
  );
});

export function PropertyOptionField({
  field,
  className,
  variant = "select",
  toolbar,
}: OptionFieldProps & { field: DBPropertyCodeField; toolbar?: React.ReactNode }) {
  const {
    inputId,
    selectedOption,
    isAddingOption,
    title,
    description,
    locale,
    options,
    selectOption,
    dictionary,
    error,
    addOption,
  } = useOptionField({
    field,
  });

  return (
    <FormFieldLayout
      title={title}
      description={description}
      error={error}
      className={className}
      config={{ focus_ring: true }}
    >
      {toolbar}
      <FormOptionInput
        inputId={inputId}
        selectedOption={selectedOption}
        isAddingOption={isAddingOption}
        options={options}
        selectOption={selectOption}
        variant={variant}
        addOption={
          addOption && {
            ...addOption,
            label: getAvailableLocalizedText(dictionary?.name, locale).toLocaleLowerCase(),
          }
        }
      />
    </FormFieldLayout>
  );
}
