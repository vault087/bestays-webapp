"use client";

import { memo } from "react";
import { Input } from "@/modules/shadcn/components/ui/input";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useOptionCodeInput } from "@cms/modules/properties/form/property-options";

export const OptionCodeInput = memo(function OptionCodeInput() {
  useDebugRender("OptionCodeInput");
  const { inputId, value, onChange, placeholder } = useOptionCodeInput();

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

OptionCodeInput.displayName = "OptionCodeInput";
