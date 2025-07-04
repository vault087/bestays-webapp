"use client";

import { Plus } from "lucide-react";
import { memo } from "react";
import { Button } from "@/modules/shadcn/components/ui/button";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store.hooks";
import { makeFormProperty } from "@cms/modules/domain-editor/utils/new-property.utils";

export const TreeAddPropertyButton = memo(function TreeAddPropertyButton() {
  useDebugRender("TreeAddPropertyButton");

  const store = useCanvasStore();

  const handleAddProperty = () => {
    store.getState().addProperty(makeFormProperty());
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleAddProperty}>
      <Plus className="h-4 w-4" />
    </Button>
  );
});

TreeAddPropertyButton.displayName = "TreeAddPropertyButton";
