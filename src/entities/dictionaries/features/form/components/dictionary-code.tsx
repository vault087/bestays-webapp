import { useTranslations } from "next-intl";
import React, { memo } from "react";
import { FormFieldError } from "@/components/form";
import { FormFloatingInput } from "@/components/form/inputs/form-floating-input";
import { DB_CODE_MAX } from "@/entities/common/types/common-db.types";
import {
  useDictionaryCodeDisplay,
  useDictionaryCodeInput,
} from "@/entities/dictionaries/features/form/hooks/use-dictionary-code";

export const DictionaryCodeInput = memo(function DictionaryCodeInput({ id }: { id: number }) {
  const { inputId, value, onChange, characterCount, error } = useDictionaryCodeInput(id, DB_CODE_MAX);
  const t = useTranslations("Dictionaries.entries.code");
  const placeholder = t("placeholder");

  return (
    <div className="flex flex-col space-y-2">
      <FormFloatingInput
        inputId={inputId}
        value={value}
        onChange={onChange}
        characterCount={characterCount}
        placeholder={placeholder}
        maxLength={DB_CODE_MAX}
        config={{
          characterCount: {
            always_show: false,
          },
        }}
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
