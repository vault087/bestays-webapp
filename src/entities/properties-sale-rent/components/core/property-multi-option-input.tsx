import React from "react";
import { useDictionaryByCode } from "@/entities/dictionaries/stores/hooks/use-dictionary-store";
import { Code } from "@/entities/dictionaries/types/dictionary.types";
import {
  usePropertyMultiOption,
  PropertyMultiOptionField,
} from "@/entities/properties-sale-rent/hooks/utils/use-property-multi-optiona";
import MultipleSelector from "@/modules/shadcn/components/ui/multiselect";

export function PropertyMultiOptionInput({
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

  const { inputId, selected, setSelected, options } = usePropertyMultiOption(
    propertyId,
    locale,
    field,
    dictionary,
    "multi-option-input",
  );

  return (
    <div className="*:not-first:mt-2">
      <p>{dictionary?.name?.[locale] || dictionaryCode}</p>
      <MultipleSelector
        inputProps={{
          id: inputId,
        }}
        commandProps={{
          label: dictionary?.name?.[locale] || dictionaryCode,
          filter: (value, search) => {
            const option = options.find((opt) => opt.code === value);
            if (!option) return 0;

            const searchLower = search.toLowerCase();
            return option.label.toLowerCase().includes(searchLower) ? 1 : 0;
          },
        }}
        value={selected.map((option) => ({
          value: option.code,
          label: option.label,
        }))}
        defaultOptions={options
          .filter((option) => option.isActive)
          .map((option) => ({
            value: option.code,
            label: option.label,
          }))}
        onChange={(value) => {
          setSelected(value.map((option) => option.value));
        }}
        placeholder={dictionary?.name?.[locale]}
        hideClearAllButton
        hidePlaceholderWhenSelected
        emptyIndicator={<p className="text-center text-sm">No results found</p>}
      />
      <p className="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
        {dictionary?.description?.[locale] || ""}
      </p>
    </div>
  );
}
