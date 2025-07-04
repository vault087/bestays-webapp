"use client";

/**
 * @fileoverview Property Name Simple Input - Basic input for property names
 */
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import { memo } from "react";
import { Input } from "@/modules/shadcn/components/ui/input";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import {
  useMetaNumberMinInput,
  useMetaNumberMaxInput,
  useMetaNumberIntegerToggle,
} from "@cms/modules/properties/form/hooks";

export const MetaNumberIntegerToggle = memo(function MetaNumberIntegerToggle() {
  useDebugRender("MetaNumberIntegerToggle");
  const { isActive, handleToggle } = useMetaNumberIntegerToggle();

  return (
    <ToggleGroup type="single" value={isActive ? "true" : "false"} onValueChange={handleToggle}>
      <ToggleGroupItem value="true">{isActive ? "Integer" : "Float"}</ToggleGroupItem>
    </ToggleGroup>
  );
});

export const MetaNumberMaxInput = memo(function MetaNumberMaxInput() {
  useDebugRender("MetaNumberMaxInput");
  const { inputId, value, onChange, placeholder } = useMetaNumberMaxInput("Input");

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

MetaNumberMaxInput.displayName = "MetaNumberMaxInput";

export const MetaNumberMinInput = memo(function MetaNumberMinInput() {
  useDebugRender("MetaNumberMinInput");
  const { inputId, value, onChange, placeholder } = useMetaNumberMinInput("Input");

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

MetaNumberMinInput.displayName = "MetaNumberMinInput";
