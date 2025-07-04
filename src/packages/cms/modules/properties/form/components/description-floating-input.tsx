"use client";

/**
 * @fileoverview Property Description Floating Input - Floating label input for property descriptions
 */
import { memo } from "react";
import { FloatingInput, FloatingLabel } from "@/modules/shadcn/components/ui/floating-label-input";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useDescriptionInput } from "@cms/modules/properties/form/hooks";
export const DescriptionFloatingInput = memo(function DescriptionFloatingInput() {
  useDebugRender("DescriptionFloatingInput");
  const { inputId, value, onChange, placeholder } = useDescriptionInput("FloatingInput");

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

DescriptionFloatingInput.displayName = "DescriptionFloatingInput";
