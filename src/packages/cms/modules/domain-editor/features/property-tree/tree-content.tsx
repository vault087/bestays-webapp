"use client";

import { List } from "lucide-react";
import { memo } from "react";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useOrderedPropertyIds } from "@cms/modules/domain-editor/hooks/use-property";
import { PropertyIdProvider } from "@cms/modules/properties/form/contexts";
import { TreeAddPropertyButton } from "./tree-add-property-button";
import { TreeItem } from "./tree-item";

// Extract to avoid inline creation
const TreePropertyItem = memo(function TreePropertyItem({ propertyId }: { propertyId: string }) {
  return (
    <PropertyIdProvider propertyId={propertyId}>
      <div className="group relative flex items-center justify-start">
        <div className="mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500 group-hover:cursor-pointer" />
        <TreeItem />
      </div>
    </PropertyIdProvider>
  );
});

export const TreeContent = memo(() => {
  useDebugRender("TreeContent");

  const propertyIds = useOrderedPropertyIds();

  if (propertyIds.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-center text-gray-500">
        <div>
          <List className="mx-auto h-6 w-6 text-gray-400" />
          <p className="mt-2 text-xs"></p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col p-3">
      <div className="space-y-1">
        {propertyIds.map((propertyId) => (
          <TreePropertyItem key={propertyId} propertyId={propertyId} />
        ))}
        <div className="mt-2 flex items-center justify-start">
          <TreeAddPropertyButton />
        </div>
      </div>
    </div>
  );
});

TreeContent.displayName = "TreeContent";
