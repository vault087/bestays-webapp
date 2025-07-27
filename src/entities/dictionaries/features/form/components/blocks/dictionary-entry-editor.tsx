"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useCallback, useMemo, useTransition, memo } from "react";
import { DBSerialID } from "@/entities/common";
import {
  DBDictionary,
  useDictionaryFormStoreActions,
  MutableEntry,
  DBDictionaryEntry,
  createDictionaryFormStore,
} from "@/entities/dictionaries";
import { insertNewEntry, updateEntries } from "@/entities/dictionaries/actions/entries";
import { DBDictionaryInsertEntry } from "@/entities/dictionaries/libs/actions/entries-action.types";
import { Button } from "@/modules/shadcn/components/ui/button";
import { Input } from "@/modules/shadcn/components/ui/input";
import { EditorDoneButton } from "./editor-done-button";
import { EditorHeader } from "./editor-header";
import { EditorListing } from "./editor-listing";
import { EditorSearchBar } from "./editor-search-bar";
import { entriesHasChanged } from "./entries-has-changed";
import { EditorStoreProvider } from "./use-edit-store";

interface DictionaryEntryEditorProps {
  dictionary: DBDictionary;
  entries: Record<DBSerialID, MutableEntry>;
  locale: string;
  onClose: () => void;
}

export const DictionaryEntryEditor = memo(({ dictionary, entries, locale, onClose }: DictionaryEntryEditorProps) => {
  const store = useMemo(
    () => createDictionaryFormStore([dictionary], Object.values(entries), "dictionary-entry-editor", false),
    [dictionary, entries],
  );
  const { addEntry } = useDictionaryFormStoreActions();
  const t = useTranslations("Dictionaries.entries.editor");
  const [newEntryName, setNewEntryName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const entriesArray = useMemo(() => Object.values(entries), [entries]);

  const [initialEntries] = useState<DBDictionaryEntry[]>(entriesArray);

  const [isAddingOption, startAddingTransition] = useTransition();
  const [isSaving, startSavingTransition] = useTransition();

  const [isEditing, setIsEditing] = useState(false);

  const handleAddEntry = useCallback(() => {
    const value = newEntryName.trim();
    if (!dictionary.id || !value) return;

    const insertingEntry: DBDictionaryInsertEntry = {
      dictionary_id: dictionary.id,
      name: { [locale]: newEntryName.trim() },
      is_active: true,
    };

    startAddingTransition(async () => {
      const response = await insertNewEntry(insertingEntry);
      if (response.error) {
        return;
      }

      if (response.data) {
        addEntry(response.data);
        setNewEntryName("");
      }
    });
  }, [dictionary.id, locale, addEntry, newEntryName]);

  const handleSave = useCallback(async () => {
    startSavingTransition(async () => {
      try {
        if (!entries || !dictionary) {
          onClose();
          return;
        }
        const currentEntries = entries[dictionary.id];
        if (!currentEntries) {
          onClose();
          return;
        }

        const hasChanged = entriesHasChanged(initialEntries, entriesArray);
        if (!hasChanged) {
          onClose();
          return;
        }
        // Convert entries to the format needed for batch update
        const entriesToUpdate: DBDictionaryInsertEntry[] = entriesArray.map((entry) => ({
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
      }
    });
  }, [entries, onClose, initialEntries, dictionary, entriesArray]);

  const addButtonDisabled = newEntryName.trim().length < 2 || isAddingOption;

  if (!dictionary) return null;

  return (
    <div className="flex h-[60vh] max-h-[80vh] flex-col space-y-2">
      {/* Header */}
      <EditorHeader dictionary={dictionary} locale={locale} />

      {/* Search bar */}
      <EditorSearchBar
        dictionary={dictionary}
        locale={locale}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFocus={() => setIsEditing(true)}
        onBlur={() => setIsEditing(false)}
      />

      <EditorStoreProvider store={store}>
        <EditorListing dictionary={dictionary} locale={locale} />
      </EditorStoreProvider>

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

      {/* Done button */}
      <EditorDoneButton isSaving={isSaving} onSave={handleSave} />
    </div>
  );
});

DictionaryEntryEditor.displayName = "DictionaryEntryEditor";
