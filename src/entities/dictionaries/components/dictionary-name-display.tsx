import React, { memo } from "react";
import { useDictionaryNameDisplay } from "@/entities/dictionaries/hooks/use-dictionary-name";

interface DictionaryNameDisplayProps {
  id: number;
  locale: string;
}

const DictionaryNameDisplay = ({ id, locale }: DictionaryNameDisplayProps) => {
  const name = useDictionaryNameDisplay(id, locale);

  if (!name) {
    return <span className="text-gray-400">No name ({locale})</span>;
  }

  return <span>{name}</span>;
};

export default memo(DictionaryNameDisplay);
