import { useMemo, useState, useCallback } from "react";
import { Code } from "@/entities/dictionaries/types/dictionary.types";
import { LocalizedText } from "@/entities/localized-text";
import { useDictionaryContext } from "@/entities/properties/components/context/dictionary.context";
import { useInitialPropertyContext } from "@/entities/properties/components/context/initial-property.context";
import {
  covertPropertyFieldToDictionaryCode,
  PropertyCodeField,
} from "@/entities/properties-sale-rent/types/property.type";
import { generateInputId } from "@/utils";

export type CodeOption = {
  code: Code;
  label: string;
};

export type CodeFieldState = {
  inputId: string;
  currentValue: CodeOption;
  options: CodeOption[];
  title: string | undefined;
  subtitle: string | undefined;
  setValue: (value: Code) => void;
};

export const useCodeField = ({
  field,
  locale,
  variant = "",
}: {
  field: PropertyCodeField;
  locale: string;
  variant?: string;
}): CodeFieldState => {
  const { dictionariesByCode, entriesByDictionaryCode } = useDictionaryContext();
  const { initialProperty, updateProperty } = useInitialPropertyContext();

  // Get initial value from context
  const initialValue = initialProperty[field] as Code;

  // Local state for immediate UI updates
  const [currentValue, setCurrentValue] = useState<Code>(initialValue);

  // Memoize computed values (options, titles) separately from current value
  const { inputId, options, title, subtitle } = useMemo(() => {
    const dictionaryCode = covertPropertyFieldToDictionaryCode[field];
    const dictionary = dictionariesByCode[dictionaryCode];
    const entries = entriesByDictionaryCode[dictionaryCode];
    const inputId = generateInputId("property-code", initialProperty.id, field, variant, locale);

    function getLocalizedText(text: LocalizedText | undefined, code: Code) {
      return text?.[locale] || code;
    }

    const options: CodeOption[] = entries
      .filter((entry) => entry.code !== null)
      .map((entry) => ({
        code: entry.code as Code,
        label: getLocalizedText(entry.name, entry.code as Code),
      }));

    const title = dictionary?.name?.[locale] || dictionary?.code || "";
    const subtitle = dictionary?.description?.[locale] || "";

    return { inputId, options, title, subtitle };
  }, [dictionariesByCode, entriesByDictionaryCode, field, variant, locale, initialProperty.id]);

  // Create current value option for display
  const currentValueOption = (): CodeOption => {
    const entries = entriesByDictionaryCode[covertPropertyFieldToDictionaryCode[field]];
    const dictionaryEntry = entries.find((entry) => entry.code === currentValue);
    const label = dictionaryEntry?.name?.[locale] || currentValue;
    return {
      code: currentValue,
      label,
    };
  };

  // Update both local state and context
  const setValue = useCallback(
    (value: Code) => {
      // Immediate UI update
      setCurrentValue(value);

      // Update context for persistence
      updateProperty((draft) => {
        draft[field] = value;
      });
    },
    [updateProperty, field],
  );

  return { inputId, currentValue: currentValueOption(), options, title, subtitle, setValue };
};
