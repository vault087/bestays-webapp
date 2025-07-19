"use client";

import { useCallback, useState } from "react";

export type UseCharacterLimit = {
  value: string;
  setValue: (value: string) => void;
  characterCount: number;
};
export function useCharacterLimit({
  maxLength,
  initialValue = "",
}: {
  maxLength: number;
  initialValue?: string;
}): UseCharacterLimit {
  const [value, setValue] = useState(initialValue);
  const [characterCount, setCharacterCount] = useState(initialValue.length);

  const handleValueChange = useCallback(
    (value: string): void => {
      if (value.length <= maxLength) {
        setValue(value);
        setCharacterCount(value.length);
      }
    },
    [maxLength, setValue, setCharacterCount],
  );

  return {
    value,
    setValue: handleValueChange,
    characterCount,
  };
}
