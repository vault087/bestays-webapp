"use client";

import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import { memo } from "react";
import { Input } from "@/modules/shadcn/components/ui/input";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useMetaTextMaxInput, useMetaTextMultilineToggle } from "@cms/modules/properties/form/hooks/use-meta-text";

export const MetaTextMultilineToggle = memo(function MetaTextMultilineToggle() {
  useDebugRender("MetaTextMultilineToggle");
  const { isActive, handleToggle } = useMetaTextMultilineToggle();

  return (
    <ToggleGroup type="single" value={isActive ? "true" : "false"} onValueChange={handleToggle}>
      <ToggleGroupItem value="true">{isActive ? "Multiline" : "Singleline"}</ToggleGroupItem>
    </ToggleGroup>
  );
});

export const MetaTextMaxInput = memo(function MetaTextMaxInput() {
  useDebugRender("MetaTextMaxInput");
  const { inputId, value, onChange, placeholder } = useMetaTextMaxInput("Input");

  return (
    <div className="flex w-full">
      <Input
        id={inputId}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-8 bg-transparent px-1 py-0 shadow-none dark:bg-transparent"
      />
    </div>
  );
});

MetaTextMaxInput.displayName = "MetaTextMaxInput";
MetaTextMultilineToggle.displayName = "MetaTextMultilineToggle";
