"use client";

import { CircleAlertIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { DBSerialID } from "@/entities/common";
import { DBDictionary, MutableEntry } from "@/entities/dictionaries";
import { Button } from "@/modules/shadcn/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@/modules/shadcn/components/ui/dialog";

export interface DictionaryEntryEditorProps {
  dictionary: DBDictionary;
  entries: Record<DBSerialID, MutableEntry>;
  locale: string;
  onClose: () => void;
}

export interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmationDialog({ isOpen, onClose, onConfirm }: DeleteConfirmationDialogProps) {
  const t = useTranslations("Dictionaries.entries.editor.delete_confirmation");

  const handleConfirm = useCallback(() => {
    onConfirm();
    onClose();
  }, [onConfirm, onClose]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
            <CircleAlertIcon className="opacity-80" size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">{t("title")}</DialogTitle>
            <DialogDescription className="sm:text-center">{t("description")}</DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5">
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="flex-1">
                {t("cancel")}
              </Button>
            </DialogClose>
            <Button type="button" variant="destructive" className="flex-1" onClick={handleConfirm}>
              {t("delete")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
