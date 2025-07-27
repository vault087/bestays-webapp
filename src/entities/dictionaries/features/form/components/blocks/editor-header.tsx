"use client";

import { useTranslations } from "next-intl";
import { memo } from "react";
import { DBDictionary } from "@/entities/dictionaries";
import { getAvailableLocalizedText } from "@/entities/localized-text/utils/get-available-localized-text";

interface EditorHeaderProps {
  dictionary: DBDictionary;
  locale: string;
}

export const EditorHeader = memo(({ dictionary, locale }: EditorHeaderProps) => {
  const t = useTranslations("Dictionaries.entries.editor");

  const title = t("dialog_title", {
    dictionaryName: getAvailableLocalizedText(dictionary.name, locale),
  });

  const description = getAvailableLocalizedText(dictionary.description, locale);

  return (
    <div>
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
      {description && (
        <div className="text-muted-foreground flex items-start justify-start pt-1 pb-4 text-sm">{description}</div>
      )}
    </div>
  );
});

EditorHeader.displayName = "EditorHeader";
