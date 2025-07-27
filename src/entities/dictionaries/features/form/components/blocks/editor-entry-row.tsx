"use client";

import { TrashIcon } from "lucide-react";
import { memo } from "react";
import { DBSerialID } from "@/entities/common";
import { MutableEntry } from "@/entities/dictionaries";
import { DictionaryEntryNameInput } from "@/entities/dictionaries/features/form/components/entry-name";
import { getAvailableLocalizedText } from "@/entities/localized-text/utils/get-available-localized-text";
import { Button } from "@/modules/shadcn/components/ui/button";
import { useEditorStore } from "./use-edit-store";

interface EditorEntryRowProps {
  entryId: DBSerialID;
  dictionaryId: number;
  locale: string;
  onDelete: (entry: MutableEntry) => void;
}

export const EditorEntryRow = memo(({ entryId, dictionaryId, locale, onDelete }: EditorEntryRowProps) => {
  const entry = useEditorStore((state) => state.entries[dictionaryId][entryId]);
  if (!entry) return null;
  return (
    <div className="flex w-full items-center justify-between space-x-2 rounded-sm sm:odd:pr-4">
      <div className="w-full min-w-0 rounded-b-none border-b-1">
        <DictionaryEntryNameInput
          placeholder={getAvailableLocalizedText(entry.name, locale)}
          dictionaryId={dictionaryId}
          entryId={entry.id}
          locale={locale}
        />
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(entry)}
        className="text-muted-foreground/80 hover:text-muted-foreground h-8 w-8 flex-shrink-0 p-0 opacity-30 hover:opacity-100"
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  );
});

EditorEntryRow.displayName = "EditorEntryRow";
