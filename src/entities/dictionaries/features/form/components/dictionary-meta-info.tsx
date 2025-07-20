import { useTranslations } from "next-intl";
import React, { memo } from "react";
import { FormTextArea } from "@/components/form/inputs/form-text-area";
import { FormFieldLayout } from "@/components/form/layout/form-field-layout";
import {
  useDictionaryMetaInfoDisplay,
  useDictionaryMetaInfoInput,
} from "@/entities/dictionaries/features/form/hooks/use-dictionary-meta-info";
import { DICTIONARY_META_INFO_MAX } from "@/entities/dictionaries/types/dictionary.types";

export const DictionaryMetaInfoDisplay = memo(function DictionaryMetaInfoDisplay({ id }: { id: number }) {
  const description = useDictionaryMetaInfoDisplay(id);

  if (!description) {
    return <span className="text-gray-400">No meta info</span>;
  }

  return <span>{description}</span>;
});

export const DictionaryMetaInfoInput = memo(function DictionaryMetaInfoInput({ id }: { id: number }) {
  const t = useTranslations("Dictionaries.fields.meta_info");
  const title = t("title");
  const description = t("description");
  const maxLength = DICTIONARY_META_INFO_MAX;
  const { inputId, value, onChange, placeholder, error, characterCount } = useDictionaryMetaInfoInput(id, maxLength);

  return (
    <FormFieldLayout title={title} description={description} error={error} inputId={inputId}>
      <FormTextArea
        inputId={inputId}
        value={value}
        onChange={onChange}
        characterCount={characterCount}
        maxLength={maxLength}
        placeholder={placeholder || ""}
        arialInvalid={!!error}
      />
    </FormFieldLayout>
  );
});
