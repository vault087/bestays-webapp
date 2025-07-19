import { useTranslations } from "next-intl";
import React, { memo, ChangeEvent } from "react";
import {
  useDictionaryDescriptionDisplay,
  useDictionaryDescriptionInput,
} from "@/entities/dictionaries/features/form/hooks/use-dictionary-description";
import { DICTIONARY_DESCRIPTION_MAX } from "@/entities/dictionaries/types/dictionary.types";
import { Textarea, Label } from "@/modules/shadcn";

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
  const title = t("label");
  const subtitle = t("subtitle");
  const maxLength = DICTIONARY_DESCRIPTION_MAX;
  const { inputId, value, onChange, placeholder, error, characterCount } = useDictionaryDescriptionInput(
    id,
    locale,
    maxLength,
  );
  const onTextAreaChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    onChange(e.target.value);
  };

  return (
    <div className="flex w-full flex-col space-y-1 bg-transparent">
      {title && (
        <Label htmlFor={inputId} className="font-open-sans text-sm font-semibold">
          {title}
        </Label>
      )}
      {subtitle && (
        <Label htmlFor={inputId} className="font-montserrat text-muted-foreground text-xs">
          {subtitle}
        </Label>
      )}

      <Textarea
        id={inputId}
        value={value}
        maxLength={maxLength}
        onChange={onTextAreaChange}
        placeholder={placeholder || ""}
        aria-describedby={`${inputId}-description`}
      />
      <p
        id={`${inputId}-description`}
        className="text-muted-foreground mt-2 text-right text-xs"
        role="status"
        aria-live="polite"
      >
        <span className="tabular-nums">{characterCount}</span> / {maxLength}
      </p>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});
