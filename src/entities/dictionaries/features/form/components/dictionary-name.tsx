import React, { memo } from "react";
import {
  useDictionaryNameDisplay,
  useDictionaryNameInput,
} from "@/entities/dictionaries/features/form/hooks/use-dictionary-name";
import { FloatingInput, FloatingLabel } from "@/modules/shadcn";

export const DictionaryNameDisplay = memo(function DictionaryNameDisplay({
  id,
  locale,
}: {
  id: number;
  locale: string;
}) {
  const name = useDictionaryNameDisplay(id, locale);

  if (!name) {
    return <span className="text-gray-400">No name ({locale})</span>;
  }

  return <span>{name}</span>;
});

export const DictionaryNameInput = memo(function DictionaryNameInput({ id, locale }: { id: number; locale: string }) {
  const { inputId, value, onChange, placeholder, error } = useDictionaryNameInput(id, locale);

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
