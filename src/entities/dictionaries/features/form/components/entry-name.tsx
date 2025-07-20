import { useTranslations } from "next-intl";
import React, { memo } from "react";
import { FormFieldError } from "@/components/form";
import { FormInput } from "@/components/form/inputs/form-input";
import {
  useDictionaryEntryNameDisplay,
  useDictionaryEntryNameInput,
} from "@/entities/dictionaries/features/form/hooks/use-entry-name";
import { DICTIONARY_ENTRY_NAME_MAX } from "@/entities/dictionaries/types/dictionary.types";

export const DictionaryEntryNameDisplay = memo(function DictionaryEntryNameDisplay({
  dictionaryId,
  entryId,
  locale,
}: {
  dictionaryId: number;
  entryId: number;
  locale: string;
}) {
  const name = useDictionaryEntryNameDisplay(dictionaryId, entryId, locale);

  if (!name) {
    return <span className="text-gray-400">No name ({locale})</span>;
  }

  return <span>{name}</span>;
});

export const DictionaryEntryNameInput = memo(function DictionaryEntryNameInput({
  dictionaryId,
  entryId,
  locale,
}: {
  dictionaryId: number;
  entryId: number;
  locale: string;
}) {
  const { inputId, value, onChange, characterCount, error, maxLength } = useDictionaryEntryNameInput(
    dictionaryId,
    entryId,
    locale,
    DICTIONARY_ENTRY_NAME_MAX,
  );
  const t = useTranslations("Dictionaries.entries.name");
  const placeholder = t("placeholder");

  return (
    <div className="flex flex-col space-y-2">
      <FormInput
        inputId={inputId}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder || ""}
        className="h-8 border-0 bg-transparent py-0 font-mono text-xs shadow-none dark:bg-transparent"
        characterCount={characterCount}
      />
      {error && <FormFieldError error={error} inputId={inputId} />}
    </div>
  );
});
