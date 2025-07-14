import { useMemo } from "react";
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
  value: Code;
  label: string;
};

export type CodeFieldState = {
  inputId: string;
  initialValue: CodeOption;
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

  const result = useMemo((): CodeFieldState => {
    const dictionaryCode = covertPropertyFieldToDictionaryCode[field];
    const dictionary = dictionariesByCode[dictionaryCode];
    const entries = entriesByDictionaryCode[dictionaryCode];
    const inputId = generateInputId("property-code", initialProperty.id, field, variant, locale);

    function getLocalizedText(text: LocalizedText | undefined, code: Code) {
      return text?.[locale] || code;
    }
    const value = initialProperty[field] as Code;
    const dictionaryEntry = entries.find((entry) => entry.code === value);
    const label = getLocalizedText(dictionaryEntry?.name, value);
    const initialValue: CodeOption = {
      value,
      label,
    };

    const options: CodeOption[] = entries
      .filter((entry) => entry.code !== null)
      .map((entry) => ({
        value: entry.code as Code,
        label: getLocalizedText(entry.name, entry.code as Code),
      }));

    const title = dictionary?.name?.[locale] || dictionary?.code || "";
    const subtitle = dictionary?.description?.[locale] || "";

    const setValue = (value: Code) => {
      updateProperty((draft) => {
        draft[field] = value;
      });
    };

    return { inputId, initialValue, options, title, subtitle, setValue };
  }, [initialProperty, dictionariesByCode, entriesByDictionaryCode, field, variant, locale, updateProperty]);

  return result;
};
