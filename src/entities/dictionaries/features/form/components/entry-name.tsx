import React, { memo } from "react";
import {
  useDictionaryEntryNameDisplay,
  useDictionaryEntryNameInput,
} from "@/entities/dictionaries/features/form/hooks/use-entry-name";
import { FloatingInput, FloatingLabel } from "@/modules/shadcn";

export const DictionaryEntryNameDisplay = memo(function DictionaryEntryNameDisplay({
  dictionaryId,
  entryId,
  locale,
}: {
  dictionaryId: number;
  entryId: number;
  locale: string;
}) {
  const name = useDictionaryEntryNameDisplay(dictionaryId, entryId, locale);

  if (!name) {
    return <span className="text-gray-400">No name ({locale})</span>;
  }

  return <span>{name}</span>;
});

export const DictionaryEntryNameInput = memo(function DictionaryEntryNameInput({
  dictionaryId,
  entryId,
  locale,
}: {
  dictionaryId: number;
  entryId: number;
  locale: string;
}) {
  const { inputId, value, onChange, placeholder, error } = useDictionaryEntryNameInput(dictionaryId, entryId, locale);
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
