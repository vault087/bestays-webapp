import { useTranslations } from "next-intl";
import React, { memo, useMemo } from "react";
import { FormFieldError } from "@/components/form";
import { FormFloatingInput } from "@/components/form/inputs/form-floating-input";
import { DB_CODE_MAX } from "@/entities/common/code";
import {
  useDictionaryCodeDisplay,
  useDictionaryCodeInput,
} from "@/entities/dictionaries/features/form/hooks/use-dictionary-code";

export const DictionaryCodeInput = memo(function DictionaryCodeInput({ id }: { id: number }) {
  const { inputId, value, onChange, characterCount, error } = useDictionaryCodeInput(id, DB_CODE_MAX);
  const t = useTranslations("Dictionaries.entries.code");
  const placeholder = t("placeholder");

  const config = useMemo(
    () => ({
      characterCount: {
        always_show: false,
      },
    }),
    [],
  );

  return (
    <div className="flex flex-col space-y-2">
      <FormFloatingInput
        inputId={inputId}
        value={value}
        onChange={onChange}
        characterCount={characterCount}
        placeholder={placeholder}
        maxLength={DB_CODE_MAX}
        config={config}
      />
      {error && <FormFieldError error={error} inputId={inputId} />}
    </div>
  );
});

export const DictionaryCodeDisplay = memo(function DictionaryCodeDisplay({ id }: { id: number }) {
  const code = useDictionaryCodeDisplay(id);

  if (!code) {
    return <span className="text-gray-400">No code</span>;
  }
  return <span>{code}</span>;
});
