"use client";

import { memo } from "react";
import { FloatingInput, FloatingLabel } from "@/modules/shadcn/components/ui/floating-label-input";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useOptionNameInput } from "@cms/modules/properties/form/property-options";

export const OptionNameInput = memo(function OptionNameInput() {
  useDebugRender("OptionNameInput");
  const { inputId, value, onChange, placeholder } = useOptionNameInput("FloatingInput");

  return (
    <div className="relative flex w-full">
      <FloatingInput
        id={inputId}
        value={value}
        onChange={onChange}
        className="selection:bg-primary border-b-0 bg-transparent not-placeholder-shown:translate-y-2 focus:translate-y-2 dark:bg-transparent"
      />
      <FloatingLabel htmlFor={inputId} className="start-0 max-w-[calc(100%-0.5rem)]">
        {placeholder}
      </FloatingLabel>
    </div>
  );
});

OptionNameInput.displayName = "OptionNameInput";
