"use client";

import { useTranslations } from "next-intl";
import { memo, useState, useMemo } from "react";
import { FormTextArea } from "@/components/form/inputs/form-text-area";
import { FormTextInput } from "@/components/form/inputs/form-text-input";
import { FormFieldLayout } from "@/components/form/layout/form-field-layout";
import { FormFieldLayoutToolbar } from "@/components/form/layout/form-field-layout-toolbar";
import {
  DBPropertyLocalizedTextField,
  PROPERTY_ABOUT_MAX,
  PropertyLocaleProvider,
  usePropertyLocale,
  usePropertyLocalizedTextInput,
} from "@/entities/properties-sale-rent/";
import { useDebugRender } from "@/utils/use-debug-render";
import { CustomLocaleSwitcher } from "./custom-locale-switcher";

// Localized Text Uncontrolled Input
export const PropertyAboutInput = function PropertyAboutInput({ className }: { className?: string }) {
  const t = useTranslations("Properties.fields.about");
  return (
    <CustomLocalizedTextInput
      title={t("title")}
      placeholder={t("placeholder")}
      description={t("description")}
      field="about"
      maxLength={PROPERTY_ABOUT_MAX}
      className={className}
      isPrivate={false}
    />
  );
};

const CustomLocalizedTextInput = memo(function CustomLocalizedTextInput({
  title,
  description,
  maxLength,
  placeholder,
  field,
  className,
  variant = "textarea",
  isPrivate = false,
}: {
  title: string | undefined;
  placeholder: string | undefined;
  description: string | undefined;
  maxLength: number;
  field: DBPropertyLocalizedTextField;
  className?: string;
  variant?: "textarea" | "input";
  isPrivate?: boolean;
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
      <PropertyLocalizedTextInput
        title={title}
        description={description}
        maxLength={maxLength}
        placeholder={placeholder}
        field={field}
        className={className}
        variant={variant}
        toolbar={toolbar}
        isPrivate={isPrivate}
      />
    </PropertyLocaleProvider>
  );
});

export const PropertyLocalizedTextInput = memo(function PropertyLocalizedTextInput({
  title,
  description,
  maxLength,
  placeholder,
  field,
  className,
  variant = "textarea",
  isPrivate = false,
  toolbar,
}: {
  title: string | undefined;
  placeholder: string | undefined;
  description: string | undefined;
  maxLength: number;
  field: DBPropertyLocalizedTextField;
  className?: string;
  variant?: "textarea" | "input";
  isPrivate?: boolean;
  toolbar?: React.ReactNode;
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
      config={{ focus_ring: true, isPrivate }}
    >
      {toolbar}
      {variant === "textarea" ? (
        <FormTextArea
          inputId={inputId}
          value={value}
          onChange={onChange}
          characterCount={characterCount}
          maxLength={maxLength}
          placeholder={placeholder || ""}
          arialInvalid={!!error}
          config={{ textarea: { className: "focus-visible:ring-0" } }}
        />
      ) : (
        <FormTextInput
          inputId={inputId}
          value={value}
          onChange={onChange}
          characterCount={characterCount}
          maxLength={maxLength}
          placeholder={placeholder || ""}
          className="-mt-2 rounded-b-none border-b-1"
          arialInvalid={!!error}
        />
      )}
    </FormFieldLayout>
  );
});
