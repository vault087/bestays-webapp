"use client";

import { EllipsisVertical, FilesIcon, TrashIcon, Trash } from "lucide-react";
import { memo, useCallback, useState } from "react";
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
import { usePropertyOptionCRUD } from "@cms/modules/domain-editor/features/property-editing";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";

export const PropertyOptionContextMenu = memo(function PropertyOptionContextMenu({
  propertyId,
  optionId,
}: {
  propertyId: string;
  optionId: string;
}) {
  useDebugRender("PropertyOptionContextMenu");

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const { clonePropertyOption, deletePropertyOption } = usePropertyOptionCRUD(propertyId);

  const handleClone = useCallback(() => {
    clonePropertyOption(optionId);
  }, [clonePropertyOption, optionId]);

  const handleDelete = useCallback(() => {
    deletePropertyOption(optionId);
  }, [deletePropertyOption, optionId]);

  const deleteConfirmation = (
    <AlertDialogContent>
      <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
          <Trash className="opacity-80" size={16} />
        </div>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete option</AlertDialogTitle>
          <AlertDialogDescription>Are you sure you want to delete this option?</AlertDialogDescription>
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
        <Button
          variant="ghost"
          size="icon"
          className="hover:text-primary h-4 w-4 p-0 hover:bg-transparent"
          data-testid={`property-option-context-menu-${optionId}`}
        >
          <EllipsisVertical className="h-3 w-3" />
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
    <>
      <div className="absolute top-1/2 -right-1 -translate-y-1/2 opacity-60">{dropdownMenu}</div>
      <AlertDialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        {deleteConfirmation}
      </AlertDialog>
    </>
  );
});

PropertyOptionContextMenu.displayName = "PropertyOptionContextMenu";
