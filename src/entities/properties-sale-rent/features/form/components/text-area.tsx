"use client";

import { useTranslations } from "next-intl";
import { memo } from "react";
import { FormTextArea } from "@/components/form/inputs/form-text-area";
import { FormFieldLayout } from "@/components/form/layout/form-field-layout";
import { DBPropertyTextField, usePropertyTextInput, PROPERTY_AGENT_NOTES_MAX } from "@/entities/properties-sale-rent/";
import { cn } from "@/modules/shadcn/utils/cn";
import { useDebugRender } from "@/utils/use-debug-render";

// Text Uncontrolled Input
export const PropertyPersonalNotesInput = function PropertyPersonalNotesInput({ className }: { className?: string }) {
  const t = useTranslations("PropertiesSaleRent.fields");
  const title = t("personal_notes.title");
  const description = t("personal_notes.description");
  const placeholder = t("personal_notes.placeholder");
  return (
    <PropertyTextArea
      title={title}
      placeholder={placeholder}
      description={description}
      field="personal_notes"
      maxLength={PROPERTY_AGENT_NOTES_MAX}
      className={className}
    />
  );
};

// Base Input
export const PropertyTextArea = memo(function PropertyTextArea({
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

  useDebugRender("PropertyTextArea" + title);
  return (
    <FormFieldLayout
      title={title}
      description={description}
      error={error}
      inputId={inputId}
      className={cn(className, "ring-foreground/20 ring-1")}
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
