"use client";

import { useTranslations } from "next-intl";
import { ChangeEvent, memo } from "react";
import {
  DBPropertyTextField,
  PropertyFieldDecription,
  PropertyFieldHeader,
  usePropertyTextInput,
  PROPERTY_AGENT_NOTES_MAX,
} from "@/entities/properties-sale-rent/";
import { Textarea } from "@/modules/shadcn/";
import { useDebugRender } from "@/utils/use-debug-render";

// Text Uncontrolled Input
export const PropertyAgentNotesInput = function PropertyAgentNotesInput() {
  const t = useTranslations("PropertiesSaleRent.fields");
  const title = t("agent_notes.label");
  const subtitle = t("agent_notes.subtitle");
  const placeholder = t("agent_notes.placeholder");
  return (
    <PropertyTextInput
      title={title}
      placeholder={placeholder}
      subtitle={subtitle}
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
  subtitle,
  field,
}: {
  title?: string | undefined;
  placeholder?: string | undefined;
  maxLength: number;
  subtitle?: string | undefined;
  field: DBPropertyTextField;
}) {
  const { inputId, value, onChange, error, characterCount } = usePropertyTextInput(field, maxLength);

  const onTextAreaChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    onChange(e.target.value);
  };

  useDebugRender("TextUncontrolledInput" + title);
  return (
    <div className="flex w-full flex-col space-y-2 bg-transparent">
      {title && <PropertyFieldHeader text={title} inputId={inputId} />}
      {subtitle && <PropertyFieldDecription text={subtitle} inputId={inputId} />}

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

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});
