"use client";

import { SearchIcon, Plus, CircleAlertIcon, TrashIcon, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useCallback, useMemo, useTransition } from "react";
import { DBSerialID } from "@/entities/common";
import { DBDictionary, useDictionaryFormStoreActions, MutableEntry, DBDictionaryEntry } from "@/entities/dictionaries";
import { insertNewEntry, updateEntries } from "@/entities/dictionaries/actions/entries";
import { DictionaryEntryNameInput } from "@/entities/dictionaries/features/form/components/entry-name";
import { DBEntriesResponse } from "@/entities/dictionaries/libs";
import { DBDictionaryInsertEntry } from "@/entities/dictionaries/libs/actions/entries-action.types";
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

export function DictionaryEntryEditor({ dictionary, entries, locale, onClose }: DictionaryEntryEditorProps) {
  const [newEntryName, setNewEntryName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogEntry, setDeleteDialogEntry] = useState<MutableEntry | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { addEntry, deleteEntry } = useDictionaryFormStoreActions();
  const t = useTranslations("Dictionaries.entries.editor");
  const tCommon = useTranslations("Common");

  const entryList = useMemo(() => {
    return Object.values(entries).sort((a, b) => a.name?.[locale]?.localeCompare(b.name?.[locale] || "") || 0);
  }, [entries, locale]);

  const [isAddingOption, startTransition] = useTransition();
  const dictionaryId = dictionary?.id;

  // Filter entries based on search query
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entryList;

    return entryList.filter((entry) => {
      const entryName = entry.name?.[locale] || "";
      return entryName.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [entryList, searchQuery, locale]);

  const handleAddEntry = useCallback(() => {
    const value = newEntryName.trim();
    if (!dictionaryId || !value) return;
    console.log("handleAddEntry", newEntryName);

    const insertingEntry: DBDictionaryInsertEntry = {
      dictionary_id: dictionaryId,
      name: { [locale]: newEntryName.trim() },
      is_active: true,
    };
    console.log("insertingEntry", insertingEntry);
    startTransition(async () => {
      const response = await insertNewEntry(insertingEntry);
      if (response.error) {
        console.error("Insert option error:", response.error);
        return;
      }

      const newEntry = response.data;
      if (newEntry) {
        addEntry(newEntry);
        setNewEntryName("");
      }
    });
  }, [dictionaryId, locale, addEntry, newEntryName]);

  const handleDeleteEntry = useCallback((entry: MutableEntry) => {
    setDeleteDialogEntry(entry);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deleteDialogEntry) {
      deleteEntry(dictionary.id, deleteDialogEntry.id);
    }
  }, [deleteDialogEntry, dictionary.id, deleteEntry]);

  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialogEntry(null);
  }, []);

  const [initialEntries] = useState(Object.values(entries) as DBDictionaryEntry[]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const hasChanged = checkEntriesChanged(initialEntries, Object.values(entries) as DBDictionaryEntry[]);
      if (!hasChanged) {
        onClose();
        return;
      }
      // Convert entries to the format needed for batch update
      const entriesToUpdate: DBDictionaryInsertEntry[] = Object.values(entries).map((entry) => ({
        id: entry.id,
        dictionary_id: entry.dictionary_id,
        name: entry.name,
        is_active: entry.is_active,
      }));

      const response = await updateEntries(entriesToUpdate);
      if (response.error) {
        console.error("Batch update error:", response.error);
        // You might want to show an error toast here
        return;
      }

      // Close the dialog on successful save
      onClose();
    } catch (error) {
      console.error("Failed to save entries:", error);
      // You might want to show an error toast here
    } finally {
      setIsSaving(false);
    }
  }, [entries, onClose, initialEntries]);

  const title = t("dialog_title", {
    dictionaryName: getAvailableLocalizedText(dictionary.name, locale),
  });

  const description = getAvailableLocalizedText(dictionary.description, locale);

  const addButtonDisabled = newEntryName.trim().length < 2 || isAddingOption;

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
            <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex w-full items-center justify-between space-x-2 rounded-sm sm:odd:pr-4"
                >
                  <div className="w-full min-w-0 rounded-b-none border-b-1">
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
          <Button onClick={handleAddEntry} disabled={addButtonDisabled} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Save button in dialog footer */}
      <DialogFooter className="mt-4">
        <Button type="button" onClick={handleSave} disabled={isSaving} className="min-w-[80px]">
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {tCommon("saving")}
            </>
          ) : (
            tCommon("done")
          )}
        </Button>
      </DialogFooter>

      {/* Delete confirmation dialog */}
      <DeleteConfirmationDialog
        isOpen={!!deleteDialogEntry}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
      />

      {/* Unsaved changes dialog */}
      {/* <UnsavedChangesDialog isOpen={showUnsavedDialog} onClose={handleCancelClose} onConfirm={handleConfirmClose} /> */}
    </>
  );
}

function checkEntriesChanged(initial: DBDictionaryEntry[] | undefined, current: DBDictionaryEntry[]): boolean {
  if (!initial) return true;
  if (!current) return true;
  if (initial.length !== current.length) return true;
  return initial.some((entry, index) => checkEntryChanged(entry, current[index]));
}

function checkEntryChanged(initial: DBDictionaryEntry | undefined, current: DBDictionaryEntry): boolean {
  if (!initial) return true;

  const initialComparable = { ...initial };
  const currentComparable = { ...current };

  return shallowDiff(initialComparable, currentComparable);
}

function shallowDiff(obj1: Record<string, unknown>, obj2: Record<string, unknown>): boolean {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return true;
  }

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return true;
    }
  }

  return false;
}
