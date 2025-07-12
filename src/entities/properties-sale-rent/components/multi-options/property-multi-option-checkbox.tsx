import React from "react";
import { useDictionaryByCode } from "@/entities/dictionaries/stores/hooks/use-dictionary-store";
import { Code } from "@/entities/dictionaries/types/dictionary.types";
import {
  usePropertyMultiOption,
  PropertyMultiOptionField,
} from "@/entities/properties-sale-rent/hooks/utils/use-property-multi-optiona";
import { Checkbox } from "@/modules/shadcn/components/ui/checkbox";
import { Label } from "@/modules/shadcn/components/ui/label";

export function PropertyMultiOptionCheckbox({
  propertyId,
  field,
  dictionaryCode,
  locale,
}: {
  propertyId: string;
  field: PropertyMultiOptionField;
  dictionaryCode: Code;
  locale: string;
}) {
  const dictionary = useDictionaryByCode(dictionaryCode);

  const { inputId, selected, toggle, options } = usePropertyMultiOption(
    propertyId,
    locale,
    field,
    dictionary,
    "multi-option-checkbox",
  );

  console.log("[RENDER] PropertyMultiOptionCheckbox");

  return (
    <div className="*:not-first:mt-2">
      <p>{dictionary?.name?.[locale] || dictionaryCode}</p>
      {options.map((option) => (
        <div className="flex items-center gap-2" key={option.code + option.label}>
          <Checkbox
            id={inputId}
            checked={selected?.some((selectedOption) => selectedOption.code === option.code)}
            onCheckedChange={() => {
              toggle(option.code);
            }}
          />
          <Label htmlFor={inputId}>{option.label}</Label>
        </div>
      ))}
      <p className="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
        {dictionary?.description?.[locale] || ""}
      </p>
    </div>
  );
}
