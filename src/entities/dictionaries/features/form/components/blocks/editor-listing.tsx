import { useTranslations } from "next-intl";
import { memo, useCallback, useState } from "react";
import { DBSerialID } from "@/entities/common";
import { DBDictionary, MutableEntry, useDictionaryFormStoreActions } from "@/entities/dictionaries";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";
import { EditorEntryRow } from "./editor-entry-row";
import { useEditorStore } from "./use-edit-store";

export const EditorListing = memo(
  ({ dictionary, locale }: { dictionary: DBDictionary; locale: string }) => {
    const t = useTranslations("Dictionaries.entries.editor");
    const [deleteDialogEntry, setDeleteDialogEntry] = useState<MutableEntry | null>(null);

    const getSortedIndexes = useCallback(
      (entries: Record<DBSerialID, MutableEntry>) => {
        const sortedEntries = Object.values(entries).sort(
          (a, b) => a.name?.[locale]?.localeCompare(b.name?.[locale] || "") || 0,
        );
        return sortedEntries.map((entry) => entry.id);
      },
      [locale],
    );

    const { deleteEntry } = useDictionaryFormStoreActions();
    const indexes = useEditorStore((state) => getSortedIndexes(state.entries[dictionary.id])) || [];
    console.log("indexes", indexes);

    const handleDeleteEntry = useCallback((entry: MutableEntry) => {
      setDeleteDialogEntry(entry);
    }, []);

    const handleConfirmDelete = useCallback(() => {
      if (deleteDialogEntry && dictionary) {
        deleteEntry(dictionary.id, deleteDialogEntry.id);
      }
    }, [deleteDialogEntry, dictionary, deleteEntry]);

    const handleCloseDeleteDialog = useCallback(() => {
      setDeleteDialogEntry(null);
    }, []);

    return (
      <>
        {/* Entries list */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
            {indexes.length > 0 &&
              indexes.map((id) => (
                <EditorEntryRow
                  key={id}
                  entryId={id}
                  dictionaryId={dictionary.id}
                  locale={locale}
                  onDelete={handleDeleteEntry}
                />
              ))}
          </div>

          {!indexes ||
            (indexes.length === 0 && (
              <div className="text-muted-foreground flex h-20 items-center justify-center text-sm">
                {t("not_found")}
              </div>
            ))}
        </div>

        {/* Delete confirmation dialog */}
        <DeleteConfirmationDialog
          isOpen={!!deleteDialogEntry}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleConfirmDelete}
        />
      </>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.dictionary.id === nextProps.dictionary.id && prevProps.locale === nextProps.locale;
  },
);

EditorListing.displayName = "EditorListing";
