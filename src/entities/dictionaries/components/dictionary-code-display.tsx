import React, { memo } from "react";
import { useDictionaryCodeDisplay } from "@/entities/dictionaries/hooks/use-dictionary-code";

interface DictionaryCodeDisplayProps {
  id: number;
}

const DictionaryCodeDisplay = ({ id }: DictionaryCodeDisplayProps) => {
  const code = useDictionaryCodeDisplay(id);

  if (!code) {
    return <span className="text-gray-400">No code</span>;
  }

  return <span>{code}</span>;
};

export default memo(DictionaryCodeDisplay);
