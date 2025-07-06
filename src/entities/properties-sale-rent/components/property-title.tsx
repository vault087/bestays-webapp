import React, { memo } from "react";
import {
  usePropertyTitleDisplay,
  usePropertyTitleInput,
} from "@/entities/properties-sale-rent/hooks/use-property-title";
import { FloatingInput, FloatingLabel } from "@/modules/shadcn";

export const PropertyTitleDisplay = memo(function PropertyTitleDisplay({ id, locale }: { id: string; locale: string }) {
  const title = usePropertyTitleDisplay(id, locale);

  return <span>{title}</span>;
});

export const PropertyTitleInput = memo(function PropertyTitleInput({ id, locale }: { id: string; locale: string }) {
  const { inputId, value, onChange, placeholder, error } = usePropertyTitleInput(id, locale);

  return (
    <div className="relative space-y-1">
      <FloatingInput
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="selection:bg-primary border-b-0 bg-transparent not-placeholder-shown:translate-y-2 focus:translate-y-2 dark:bg-transparent"
      />
      <FloatingLabel htmlFor={inputId} className="start-0 max-w-[calc(100%-0.5rem)]">
        {placeholder}
      </FloatingLabel>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});
