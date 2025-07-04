"use client";

import { memo } from "react";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { TreeContent } from "./tree-content";

export const PropertyNavigation = memo(function PropertyNavigation() {
  useDebugRender("PropertyNavigation");

  return (
    <div className="bg-secondary w-48 overflow-hidden rounded opacity-100 transition-all duration-300 ease-in-out">
      <div className="flex h-full w-full flex-col">
        <TreeContent />
      </div>
    </div>
  );
});
