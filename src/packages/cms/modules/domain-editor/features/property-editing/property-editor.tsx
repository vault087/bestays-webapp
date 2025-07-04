"use client";

import { EllipsisVertical, FilesIcon, GripVertical, TrashIcon, Trash } from "lucide-react";
import { memo, useCallback, useState, useDeferredValue } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/modules/shadcn/components/ui/alert-dialog";
import { Button } from "@/modules/shadcn/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/modules/shadcn/components/ui/dropdown-menu";
import { useDragHandleProps, usePropertyContext } from "@cms/modules/domain-editor/contexts";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { usePropertyDisplay } from "@cms/modules/domain-editor/hooks/use-property";
import { useCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store.hooks";
import { useLayoutStore } from "@cms/modules/domain-editor/stores/layout-store/layout.store.hooks";
import {
  CodeInput,
  NameInput,
  TypeSelector,
  IsLockedToggleButton,
  IsPrivateToggleButton,
  IsRequiredToggleButton,
} from "@cms/modules/properties/form";
import { FormProperty } from "@cms/modules/properties/form/types";
import { PropertyAdvanced } from "./components/property-advanced";
import { PropertyOptionCompactList } from ".";

export const PropertyEditor = memo(function PropertyEditor() {
  useDebugRender("PropertyEditor");
  const layoutStore = useLayoutStore();
  const showPropertyCode = layoutStore((state) => state.showPropertyCode);
  const showAdvancedSettings = layoutStore((state) => state.showAdvancedSettings);

  // Defer heavy advanced settings rendering to improve performance
  const deferredShowAdvancedSettings = useDeferredValue(showAdvancedSettings);

  const { propertyId } = usePropertyContext();
  const canvasStore = useCanvasStore();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const dragHandleProps = useDragHandleProps();

  // 🎯 Get current property type for conditional compact mode rendering
  const propertyType = usePropertyDisplay({
    getValue: (property: FormProperty) => property.type || "text",
  });

  const handleDelete = useCallback(() => {
    canvasStore.getState().deleteProperty(propertyId);
  }, [canvasStore, propertyId]);

  const handleClone = useCallback(() => {
    canvasStore.getState().cloneProperty(propertyId);
  }, [canvasStore, propertyId]);

  const deleteConfirmation = (
    <AlertDialogContent>
      <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
          <Trash className="opacity-80" size={16} />
        </div>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete field</AlertDialogTitle>
          <AlertDialogDescription>Are you sure you want to delete this field?</AlertDialogDescription>
        </AlertDialogHeader>
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDelete}>
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );

  const dropdownMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:text-primary hover:bg-transparent">
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-(--radix-dropdown-menu-trigger-width)">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleClone}>
            <FilesIcon size={16} className="opacity-60" aria-hidden="true" />
            Clone
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={() => setShowDeleteConfirmation(true)}>
            <TrashIcon size={16} aria-hidden="true" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="group bg-background relative flex w-xs flex-col items-start justify-center space-y-0 rounded-md border-1 shadow-lg select-none sm:w-sm">
      {/* Property code */}
      {showPropertyCode && (
        <div className="flex w-full flex-row justify-between border-b-1">
          <CodeInput />
        </div>
      )}

      {/* Basic information */}
      <div
        className={`relative flex w-full flex-row items-center justify-between space-x-2 p-2 ${showPropertyCode ? "rounded-t-none" : ""}`}
      >
        <TypeSelector />
        <div className="flex w-full flex-col items-start justify-center space-y-0 pe-4" id={`property-${propertyId}`}>
          <NameInput />
        </div>

        {/* Menu */}
        <div className="absolute top-1/2 -right-3 -translate-y-1/2 opacity-60">{dropdownMenu}</div>

        <div
          {...dragHandleProps}
          className={`absolute top-1/2 -left-7 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center opacity-0 select-none group-hover:opacity-100 ${
            deferredShowAdvancedSettings ? "opacity-100" : "opacity-0"
          }`}
        >
          <GripVertical className="text-muted-foreground h-4 w-4 opacity-60" />
        </div>
      </div>

      {/* 🏷️ COMPACT MODE: Badge interface for option properties when advanced settings is OFF */}
      {!deferredShowAdvancedSettings && propertyType === "option" && (
        <div className="mb-2 flex w-full flex-col items-center justify-center transition-all duration-200 ease-out">
          <PropertyOptionCompactList />
        </div>
      )}

      {/* 🔧 ADVANCED MODE: Full property settings when advanced settings is ON */}
      {deferredShowAdvancedSettings && (
        <div className="mb-2 flex w-full flex-col items-center justify-center transition-all duration-200 ease-out">
          <PropertyAdvanced />
        </div>
      )}

      <div className="absolute top-2 -right-8 flex w-8 cursor-pointer flex-col items-center justify-start space-y-1 select-none">
        {showPropertyCode && <IsLockedToggleButton alwaysVisible={deferredShowAdvancedSettings} />}
        <IsRequiredToggleButton alwaysVisible={deferredShowAdvancedSettings} />
        <IsPrivateToggleButton alwaysVisible={deferredShowAdvancedSettings} />
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        {deleteConfirmation}
      </AlertDialog>
    </div>
  );
});
