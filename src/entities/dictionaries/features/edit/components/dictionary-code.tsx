import React, { memo } from "react";
import {
  useDictionaryCodeDisplay,
  useDictionaryCodeInput,
} from "@/entities/dictionaries/features/edit/hooks/use-dictionary-code";
import { FloatingInput, FloatingLabel } from "@/modules/shadcn/components/ui/floating-label-input";

export const DictionaryCodeInput = memo(function DictionaryCodeInput({ id }: { id: number }) {
  const { inputId, value, onChange, placeholder, error } = useDictionaryCodeInput(id);

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

export const DictionaryCodeDisplay = memo(function DictionaryCodeDisplay({ id }: { id: number }) {
  const code = useDictionaryCodeDisplay(id);

  if (!code) {
    return <span className="text-gray-400">No code</span>;
  }

  return <span>{code}</span>;
});
