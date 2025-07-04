"use client";

/**
 * @fileoverview Property Name Simple Input - Basic input for property names
 */
import { memo } from "react";
import { Input } from "@/modules/shadcn/components/ui/input";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useNameInput } from "@cms/modules/properties/form/hooks";

export const NameInput = memo(function NameInput() {
  useDebugRender("NameInput");
  const { inputId, value, onChange, placeholder } = useNameInput("Input");

  return (
    <div className="flex w-full">
      <Input
        id={inputId}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-8 bg-transparent py-0 shadow-none dark:bg-transparent"
      />
    </div>
  );
});

NameInput.displayName = "NameInput";
