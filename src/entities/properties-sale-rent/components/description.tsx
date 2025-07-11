import React, { memo } from "react";
import { usePropertyDescriptionDisplay, usePropertyDescriptionInput } from "@/entities/properties-sale-rent";
import { useTranslations } from "@/modules/i18n";
import { FloatingInput, FloatingLabel } from "@/modules/shadcn";

export const PropertyDescriptionDisplay = memo(function PropertyDescriptionDisplay({
  id,
  locale,
}: {
  id: string;
  locale: string;
}) {
  const description = usePropertyDescriptionDisplay(id, locale);

  if (!description) {
    return <span className="text-gray-400">No description ({locale})</span>;
  }

  return <span>{description}</span>;
});

export const PropertyDescriptionInput = memo(function PropertyDescriptionInput({
  id,
  locale,
}: {
  id: string;
  locale: string;
}) {
  const { t } = useTranslations("PropertiesSaleRent.fields");
  const { inputId, value, onChange, error } = usePropertyDescriptionInput(id, locale);

  return (
    <div className="relative space-y-1">
      <FloatingInput
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="selection:bg-primary border-b-0 bg-transparent not-placeholder-shown:translate-y-2 focus:translate-y-2 dark:bg-transparent"
      />
      <FloatingLabel htmlFor={inputId} className="start-0 max-w-[calc(100%-0.5rem)]">
        {t("description.placeholder")}
      </FloatingLabel>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});
