import React, { memo } from "react";
import { useDictionaryEntryNameDisplay } from "@/entities/dictionaries/hooks/use-dictionary-entry-name";

interface DictionaryEntryNameDisplayProps {
  dictionaryId: number;
  entryId: number;
  locale: string;
}

const DictionaryEntryNameDisplay = ({ dictionaryId, entryId, locale }: DictionaryEntryNameDisplayProps) => {
  const name = useDictionaryEntryNameDisplay(dictionaryId, entryId, locale);

  if (!name) {
    return <span className="text-gray-400">No name ({locale})</span>;
  }

  return <span>{name}</span>;
};

export default memo(DictionaryEntryNameDisplay);
