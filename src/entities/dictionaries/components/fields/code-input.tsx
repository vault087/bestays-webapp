"use client";

/**
 * @fileoverview Property Code Input - Product-ready, minimal dependency, modular
 */
import { memo } from "react";
import { Input } from "@/modules/shadcn/components/ui/input";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useCodeInput } from "@cms/modules/properties/form/hooks";

export const CodeInput = memo(function CodeInput() {
  useDebugRender("CodeInput");
  const { inputId, value, onChange, placeholder } = useCodeInput();

  return (
    <div className="flex w-full bg-transparent">
      <span className="border-input inline-flex h-8 items-center rounded-s-md rounded-b-none border-0 border-e-1 px-3 font-mono text-xs">
        Code
      </span>
      <Input
        id={inputId}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-8 bg-transparent py-0 font-mono text-xs dark:bg-transparent"
      />
    </div>
  );
});

CodeInput.displayName = "CodeInput";
