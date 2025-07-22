"use client";

import { useTranslations } from "next-intl";
import { memo } from "react";
import { FormTextArea } from "@/components/form/inputs/form-text-area";
import { FormFieldLayout } from "@/components/form/layout/form-field-layout";
import { DBPropertyTextField, usePropertyTextInput, PROPERTY_AGENT_NOTES_MAX } from "@/entities/properties-sale-rent/";
import { useDebugRender } from "@/utils/use-debug-render";

// Text Uncontrolled Input
export const PropertyAgentNotesInput = function PropertyAgentNotesInput({ className }: { className?: string }) {
  const t = useTranslations("PropertiesSaleRent.fields");
  const title = t("agent_notes.title");
  const description = t("agent_notes.description");
  const placeholder = t("agent_notes.placeholder");
  return (
    <PropertyTextInput
      title={title}
      placeholder={placeholder}
      description={description}
      field="agent_notes"
      maxLength={PROPERTY_AGENT_NOTES_MAX}
      className={className}
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
}: {
  title?: string | undefined;
  placeholder?: string | undefined;
  maxLength: number;
  description?: string | undefined;
  field: DBPropertyTextField;
  className?: string;
}) {
  const { inputId, value, onChange, error, characterCount } = usePropertyTextInput(field, maxLength);

  useDebugRender("PropertyTextInput" + title);
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
