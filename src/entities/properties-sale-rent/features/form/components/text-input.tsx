"use client";

import { useTranslations } from "next-intl";
import { ChangeEvent, memo } from "react";
import { FormFieldLayout } from "@/components/form/form-field-layout";
import { DBPropertyTextField, usePropertyTextInput, PROPERTY_AGENT_NOTES_MAX } from "@/entities/properties-sale-rent/";
import { Textarea } from "@/modules/shadcn/";
import { useDebugRender } from "@/utils/use-debug-render";

// Text Uncontrolled Input
export const PropertyAgentNotesInput = function PropertyAgentNotesInput() {
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
}: {
  title?: string | undefined;
  placeholder?: string | undefined;
  maxLength: number;
  description?: string | undefined;
  field: DBPropertyTextField;
}) {
  const { inputId, value, onChange, error, characterCount } = usePropertyTextInput(field, maxLength);

  const onTextAreaChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    onChange(e.target.value);
  };

  useDebugRender("PropertyTextInput" + title);
  return (
    <FormFieldLayout title={title} description={description} error={error} inputId={inputId}>
      <Textarea
        id={inputId}
        value={value}
        maxLength={maxLength}
        onChange={onTextAreaChange}
        placeholder={placeholder || ""}
        aria-describedby={`${inputId}-description`}
      />
      <p
        id={`${inputId}-description`}
        className="text-muted-foreground mt-2 text-right text-xs"
        role="status"
        aria-live="polite"
      >
        <span className="tabular-nums">{maxLength - characterCount}</span> characters left
      </p>
    </FormFieldLayout>
  );
});
