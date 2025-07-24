"use client";

import { useTranslations } from "next-intl";
import { memo } from "react";
import { FormTextArea } from "@/components/form/inputs/form-text-area";
import { FormFieldLayout } from "@/components/form/layout/form-field-layout";
import {
  DBPropertyLocalizedTextField,
  PROPERTY_ABOUT_MAX,
  usePropertyLocalizedTextInput,
} from "@/entities/properties-sale-rent/";
import { useDebugRender } from "@/utils/use-debug-render";

// Localized Text Uncontrolled Input
export const PropertyAboutInput = function PropertyAboutInput({ className }: { className?: string }) {
  const t = useTranslations("PropertiesSaleRent.fields.about");
  return (
    <PropertyLocalizedTextInput
      title={t("title")}
      placeholder={t("placeholder")}
      description={t("description")}
      field="about"
      maxLength={PROPERTY_ABOUT_MAX}
      className={className}
    />
  );
};

export const PropertyLocalizedTextInput = memo(function PropertyLocalizedTextInput({
  title,
  description,
  maxLength,
  placeholder,
  field,
  className,
}: {
  title: string | undefined;
  placeholder: string | undefined;
  description: string | undefined;
  maxLength: number;
  field: DBPropertyLocalizedTextField;
  className?: string;
}) {
  const { inputId, value, onChange, error, characterCount } = usePropertyLocalizedTextInput(field, maxLength);

  useDebugRender("PropertyLocalizedTextInput" + title);

  return (
    <FormFieldLayout
      title={title}
      description={description}
      error={error}
      inputId={inputId}
      className={className}
      config={{ focus_ring: true }}
    >
      <FormTextArea
        inputId={inputId}
        value={value}
        onChange={onChange}
        characterCount={characterCount}
        maxLength={maxLength}
        placeholder={placeholder || ""}
        arialInvalid={!!error}
        config={{ textarea_className: "focus-visible:ring-0" }}
      />
    </FormFieldLayout>
  );
});
