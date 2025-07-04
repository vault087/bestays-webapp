import React, { memo } from "react";
import { useDictionaryCodeInput } from "@/entities/dictionaries/hooks/use-dictionary-code";
import { Input } from "@/modules/shadcn/components/ui/input";

interface DictionaryCodeInputProps {
  id: number;
}

const DictionaryCodeInput = ({ id }: DictionaryCodeInputProps) => {
  const { inputId, value, onChange, placeholder, error } = useDictionaryCodeInput(id);

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

export default memo(DictionaryCodeInput);
