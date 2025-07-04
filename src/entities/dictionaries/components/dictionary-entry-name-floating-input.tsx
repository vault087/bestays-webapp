import React, { memo } from "react";
import { useDictionaryEntryNameInput } from "@/entities/dictionaries/hooks/use-dictionary-entry-name";
import { Input } from "@/modules/shadcn/components/ui/input";

interface DictionaryEntryNameFloatingInputProps {
  dictionaryId: number;
  entryId: number;
  locale: string;
}

const DictionaryEntryNameFloatingInput = ({ dictionaryId, entryId, locale }: DictionaryEntryNameFloatingInputProps) => {
  const { inputId, value, onChange, placeholder, error } = useDictionaryEntryNameInput(dictionaryId, entryId, locale);

  return (
    <div className="relative">
      <Input
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`pt-6 ${error ? "border-red-500" : ""}`}
      />
      <label htmlFor={inputId} className="absolute top-1 left-3 text-xs text-gray-500">
        {locale.toUpperCase()}
      </label>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default memo(DictionaryEntryNameFloatingInput);
