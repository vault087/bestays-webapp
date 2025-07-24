"use client";

import { useTranslations } from "next-intl";
import { memo } from "react";
import { FormTextArea } from "@/components/form/inputs/form-text-area";
import { FormTextInput } from "@/components/form/inputs/form-text-input";
import { FormFieldLayout } from "@/components/form/layout/form-field-layout";
import {
  DBPropertyTextField,
  usePropertyTextInput,
  PROPERTY_PERSONAL_NOTES_MAX,
  PROPERTY_TITLE_MAX,
} from "@/entities/properties-sale-rent/";
import { useDebugRender } from "@/utils/use-debug-render";

export const PropertyTitleInput = function PropertyTitleInput({ className }: { className?: string }) {
  const t = useTranslations("PropertiesSaleRent.fields.title");
  const title = t("title");
  const description = t("description");
  const placeholder = t("placeholder");
  return (
    <PropertyTextInput
      title={title}
      placeholder={placeholder}
      description={description}
      field="personal_title"
      maxLength={PROPERTY_TITLE_MAX}
      variant="input"
      className={className}
      isPrivate={true}
    />
  );
};

// Text Uncontrolled Input
export const PropertyPersonalNotesInput = function PropertyPersonalNotesInput({ className }: { className?: string }) {
  const t = useTranslations("PropertiesSaleRent.fields");
  const title = t("personal_notes.title");
  const description = t("personal_notes.description");
  const placeholder = t("personal_notes.placeholder");
  return (
    <PropertyTextInput
      title={title}
      placeholder={placeholder}
      description={description}
      field="personal_notes"
      maxLength={PROPERTY_PERSONAL_NOTES_MAX}
      className={className}
      isPrivate={true}
    />
  );
};

// Base Input
export const PropertyTextInput = memo(function PropertyTextInput({
  title,
  placeholder,
  maxLength,
  description,
  field,
  className,
  variant = "textarea",
  isPrivate = false,
}: {
  title?: string | undefined;
  placeholder?: string | undefined;
  maxLength: number;
  description?: string | undefined;
  field: DBPropertyTextField;
  className?: string;
  variant?: "textarea" | "input";
  isPrivate?: boolean;
}) {
  const { inputId, value, onChange, error, characterCount } = usePropertyTextInput(field, maxLength);

  useDebugRender("PropertyTextArea" + title);
  return (
    <FormFieldLayout
      title={title}
      description={description}
      error={error}
      inputId={inputId}
      config={{ focus_ring: true, isPrivate }}
      className={className}
    >
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
