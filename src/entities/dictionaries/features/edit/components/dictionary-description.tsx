import React, { memo } from "react";
import {
  useDictionaryDescriptionDisplay,
  useDictionaryDescriptionInput,
} from "@/entities/dictionaries/features/edit/hooks/use-dictionary-description";
import { FloatingInput, FloatingLabel } from "@/modules/shadcn";

export const DictionaryDescriptionDisplay = memo(function DictionaryDescriptionDisplay({
  id,
  locale,
}: {
  id: number;
  locale: string;
}) {
  const description = useDictionaryDescriptionDisplay(id, locale);

  if (!description) {
    return <span className="text-gray-400">No description ({locale})</span>;
  }

  return <span>{description}</span>;
});

export const DictionaryDescriptionInput = memo(function DictionaryDescriptionInput({
  id,
  locale,
}: {
  id: number;
  locale: string;
}) {
  const { inputId, value, onChange, placeholder, error } = useDictionaryDescriptionInput(id, locale);

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
