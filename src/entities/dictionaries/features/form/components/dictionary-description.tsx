import { useTranslations } from "next-intl";
import React, { memo } from "react";
import { FormTextArea } from "@/components/form/inputs/form-text-area";
import { FormFieldLayout } from "@/components/form/layout/form-field-layout";
import {
  useDictionaryDescriptionDisplay,
  useDictionaryDescriptionInput,
} from "@/entities/dictionaries/features/form/hooks/use-dictionary-description";
import { DICTIONARY_DESCRIPTION_MAX } from "@/entities/dictionaries/types/dictionary.types";

export const DictionaryDescriptionDisplay = memo(function DictionaryDescriptionDisplay({
  id,
  locale,
}: {
  id: number;
  locale: string;
}) {
  const description = useDictionaryDescriptionDisplay(id, locale);

  if (!description) {
    return <span className="text-gray-400">No description ({locale})</span>;
  }

  return <span>{description}</span>;
});

export const DictionaryDescriptionInput = memo(function DictionaryDescriptionInput({
  id,
  locale,
}: {
  id: number;
  locale: string;
}) {
  const t = useTranslations("Dictionaries.fields.description");
  const title = t("title");
  const description = t("description");
  const maxLength = DICTIONARY_DESCRIPTION_MAX;
  const { inputId, value, onChange, placeholder, error, characterCount } = useDictionaryDescriptionInput(
    id,
    locale,
    maxLength,
  );

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
