"use client";

/**
 * @fileoverview Property Name Floating Input - Floating label input for property names
 */
import { memo } from "react";
import { FloatingInput, FloatingLabel } from "@/modules/shadcn/components/ui/floating-label-input";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useNameInput } from "@cms/modules/properties/form/hooks";

export const NameFloatingInput = memo(function NameFloatingInput() {
  useDebugRender("NameFloatingInput");
  const { inputId, value, onChange, placeholder } = useNameInput("FloatingInput");

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

NameFloatingInput.displayName = "NameFloatingInput";
