"use client";
import React, { useRef, memo } from "react";
import { Code, Dictionary, DictionaryEntry } from "@/entities/dictionaries/types/dictionary.types";
import { Checkbox } from "@/modules/shadcn/components/ui/checkbox";
import { Label } from "@/modules/shadcn/components/ui/label";

export const MultiOptionCheckbox = memo(function MultiOptionCheckbox({
  inputId,
  initialValues,
  setValue,
  options,
  dictionary,
  locale,
}: {
  inputId: string;
  initialValues: Code[];
  setValue: (value: Code[]) => void;
  options: DictionaryEntry[];
  dictionary: Dictionary;
  locale: string;
}) {
  console.log("[RENDER] PropertyMultiOptionCheckbox");
  const checkedOptions = useRef(initialValues);
  const name = dictionary?.name?.[locale] || dictionary?.code || "";

  const subtitle = dictionary?.description?.[locale] || "";

  const optionName = (option: DictionaryEntry) => option.name?.[locale] || option.code || "";
  const handleChange = (option: DictionaryEntry) => {};
  return (
    <div className="*:not-first:mt-2">
      <p>{name}</p>
      {options.map((option) => (
        <div className="flex items-center gap-2" key={option.id}>
          <Checkbox
            id={inputId}
            defaultChecked={initialValues.includes(option.code || "")}
            onCheckedChange={() => {
              handleChange(option);
            }}
          />
          <Label htmlFor={inputId}>{optionName(option)}</Label>
        </div>
      ))}
      <p className="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
        {subtitle}
      </p>
    </div>
  );
});
