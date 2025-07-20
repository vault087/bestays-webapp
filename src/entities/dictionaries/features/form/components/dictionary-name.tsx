import { useTranslations } from "next-intl";
import React, { memo } from "react";
import { FormTextInput } from "@/components/form/inputs/form-text-input";
import { FormFieldLayout } from "@/components/form/layout/form-field-layout";
import {
  useDictionaryNameDisplay,
  useDictionaryNameInput,
} from "@/entities/dictionaries/features/form/hooks/use-dictionary-name";
import { DICTIONARY_NAME_MAX } from "@/entities/dictionaries/types/dictionary.types";

export const DictionaryNameDisplay = memo(function DictionaryNameDisplay({
  id,
  locale,
}: {
  id: number;
  locale: string;
}) {
  const name = useDictionaryNameDisplay(id, locale);

  if (!name) {
    return <span className="text-gray-400">No name ({locale})</span>;
  }

  return <span>{name}</span>;
});

export const DictionaryNameInput = memo(function DictionaryNameInput({ id, locale }: { id: number; locale: string }) {
  const { inputId, value, onChange, error, characterCount } = useDictionaryNameInput(id, locale, DICTIONARY_NAME_MAX);
  const t = useTranslations("Dictionaries.fields.name");
  const title = t("title");
  const placeholder = t("placeholder");
  return (
    <FormFieldLayout title={title} error={error} inputId={inputId}>
      <FormTextInput
        inputId={inputId}
        value={value}
        onChange={onChange}
        maxLength={DICTIONARY_NAME_MAX}
        placeholder={placeholder || ""}
        className="h-8 border-0 bg-transparent py-0 font-mono text-xs shadow-none dark:bg-transparent"
        characterCount={characterCount}
      />
    </FormFieldLayout>
  );
});
