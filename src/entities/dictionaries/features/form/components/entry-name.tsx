import React, { memo } from "react";
import {
  useDictionaryEntryNameDisplay,
  useDictionaryEntryNameInput,
} from "@/entities/dictionaries/features/form/hooks/use-entry-name";
import { Input } from "@/modules/shadcn";

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
  const { inputId, value, onChange, placeholder } = useDictionaryEntryNameInput(dictionaryId, entryId, locale);
  return (
    <div className="relative space-y-1">
      <Input
        id={inputId}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || ""}
        className="h-8 border-0 bg-transparent py-0 font-mono text-xs shadow-none dark:bg-transparent"
      />
    </div>
  );
});
