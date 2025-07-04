import React, { memo } from "react";
import { useDictionaryEntryCodeInput } from "@/entities/dictionaries/hooks/use-dictionary-entry-code";
import { FloatingInput, FloatingLabel } from "@/modules/shadcn";

export const DictionaryEntryCodeInput = memo(function DictionaryEntryCodeInput({
  dictionaryId,
  entryId,
}: {
  dictionaryId: number;
  entryId: number;
}) {
  const { inputId, value, onChange, placeholder, error } = useDictionaryEntryCodeInput(dictionaryId, entryId);

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
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});
