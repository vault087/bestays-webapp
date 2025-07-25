"use client";

import { SearchIcon, Plus, CircleAlertIcon, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useCallback, useMemo, useId } from "react";
import { DBSerialID } from "@/entities/common";
import { DBDictionary, useDictionaryFormStoreActions, MutableEntry } from "@/entities/dictionaries";
import { DictionaryEntryNameInput } from "@/entities/dictionaries/features/form/components/entry-name";
import { getAvailableLocalizedText } from "@/entities/localized-text/utils/get-available-localized-text";
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
import { Input } from "@/modules/shadcn/components/ui/input";
import { Label } from "@/modules/shadcn/components/ui/label";

interface DictionaryEntryEditorProps {
  dictionary: DBDictionary;
  entries: Record<DBSerialID, MutableEntry>;
  locale: string;
  onClose: () => void;
}

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteConfirmationDialog({ isOpen, onClose, onConfirm }: DeleteConfirmationDialogProps) {
  const id = useId();
  const [inputValue, setInputValue] = useState("");
  const t = useTranslations("Dictionaries.entries.editor.delete_confirmation");

  const isConfirmEnabled = inputValue.toLowerCase() === "delete";

  const handleConfirm = useCallback(() => {
    if (isConfirmEnabled) {
      onConfirm();
      setInputValue("");
      onClose();
    }
  }, [isConfirmEnabled, onConfirm, onClose]);

  const handleClose = useCallback(() => {
    setInputValue("");
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
          <div className="*:not-first:mt-2">
            <Label htmlFor={id}>{t("description")}</Label>
            <Input
              id={id}
              type="text"
              placeholder={t("input_placeholder")}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="flex-1">
                {t("cancel")}
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              className="flex-1"
              disabled={!isConfirmEnabled}
              onClick={handleConfirm}
            >
              {t("delete")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function DictionaryEntryEditor({ dictionary, entries, locale }: DictionaryEntryEditorProps) {
  const [newEntryName, setNewEntryName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogEntry, setDeleteDialogEntry] = useState<MutableEntry | null>(null);

  const { addEntry, deleteEntry } = useDictionaryFormStoreActions();
  const t = useTranslations("Dictionaries.entries.editor");
  const tCommon = useTranslations("Common");

  const entryList = useMemo(() => {
    return Object.values(entries).sort((a, b) => a.name?.[locale]?.localeCompare(b.name?.[locale] || "") || 0);
  }, [entries, locale]);

  // Filter entries based on search query
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entryList;

    return entryList.filter((entry) => {
      const entryName = entry.name?.[locale] || "";
      return entryName.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [entryList, searchQuery, locale]);

  const handleAddEntry = useCallback(() => {
    if (!newEntryName.trim()) return;

    addEntry(dictionary.id, { [locale]: newEntryName.trim() });
    setNewEntryName("");
  }, [newEntryName, dictionary.id, locale, addEntry]);

  const handleDeleteEntry = useCallback(
    (entry: MutableEntry) => {
      if (entry.is_new) {
        // For new entries, delete immediately
        deleteEntry(dictionary.id, entry.id);
      } else {
        // For existing entries, show confirmation dialog
        setDeleteDialogEntry(entry);
      }
    },
    [dictionary.id, deleteEntry],
  );

  const handleConfirmDelete = useCallback(() => {
    if (deleteDialogEntry) {
      deleteEntry(dictionary.id, deleteDialogEntry.id);
    }
  }, [deleteDialogEntry, dictionary.id, deleteEntry]);

  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialogEntry(null);
  }, []);

  const title = t("dialog_title", {
    dictionaryName: getAvailableLocalizedText(dictionary.name, locale),
  });

  const description = getAvailableLocalizedText(dictionary.description, locale);

  return (
    <>
      <div className="flex h-[60vh] max-h-[80vh] flex-col space-y-2">
        {/* Search input header */}
        <div>
          <div className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-bold">{title}</h2>
          </div>
          {description && (
            <div className="text-muted-foreground flex items-start justify-start pt-1 pb-4 text-sm">{description}</div>
          )}
        </div>
        <div className="border-input flex items-center border-b px-5" cmdk-input-wrapper="">
          <SearchIcon size={20} className="text-muted-foreground/80 me-3" />
          <Input
            data-slot="command-input-wrapper"
            className="placeholder:text-muted-foreground/70 flex h-10 w-full rounded-md border-0 bg-transparent py-3 text-sm shadow-none outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
            placeholder={tCommon("option.find_value", {
              value: getAvailableLocalizedText(dictionary.name, locale).toLocaleLowerCase(),
            })}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* Entries list */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredEntries.length === 0 ? (
            <div className="text-muted-foreground flex h-20 items-center justify-center text-sm">
              {tCommon("not_found")}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-0">
              {filteredEntries.map((entry) => (
                <div key={entry.id} className="flex items-center space-x-2 rounded-sm odd:pr-4">
                  <div className="min-w-0 flex-1 rounded-b-none border-b-1">
                    <DictionaryEntryNameInput
                      placeholder={getAvailableLocalizedText(entry.name, locale)}
                      dictionaryId={dictionary.id}
                      entryId={entry.id}
                      locale={locale}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteEntry(entry)}
                    className="text-muted-foreground/80 hover:text-muted-foreground h-8 w-8 flex-shrink-0 p-0 opacity-30 hover:opacity-100"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Add new entry */}
        <div className="flex items-center space-x-2">
          <Input
            value={newEntryName}
            className="rounded-b-none border-0 border-b-1 text-sm"
            onChange={(e) => setNewEntryName(e.target.value)}
            placeholder={t("add_placeholder")}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddEntry();
              }
            }}
          />
          <Button onClick={handleAddEntry} disabled={newEntryName.trim().length < 2} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <DeleteConfirmationDialog
        isOpen={!!deleteDialogEntry}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
