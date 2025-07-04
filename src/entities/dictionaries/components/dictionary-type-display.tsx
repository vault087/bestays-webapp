import React, { memo } from "react";
import { useDictionaryTypeDisplay } from "@/entities/dictionaries/hooks/use-dictionary-type";

interface DictionaryTypeDisplayProps {
  id: number;
}

const DictionaryTypeDisplay = ({ id }: DictionaryTypeDisplayProps) => {
  const type = useDictionaryTypeDisplay(id);

  if (!type) {
    return <span className="text-gray-400">No type</span>;
  }

  return <span>{type}</span>;
};

export default memo(DictionaryTypeDisplay);
