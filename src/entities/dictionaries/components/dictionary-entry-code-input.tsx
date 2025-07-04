import React, { memo } from "react";
import { useDictionaryEntryCodeInput } from "@/entities/dictionaries/hooks/use-dictionary-entry-code";
import { Input } from "@/modules/shadcn/components/ui/input";

interface DictionaryEntryCodeInputProps {
  dictionaryId: number;
  entryId: number;
}

const DictionaryEntryCodeInput = ({ dictionaryId, entryId }: DictionaryEntryCodeInputProps) => {
  const { inputId, value, onChange, placeholder, error } = useDictionaryEntryCodeInput(dictionaryId, entryId);

  return (
    <div className="space-y-1">
      <Input
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default memo(DictionaryEntryCodeInput);
