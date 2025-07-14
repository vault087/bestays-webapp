import { useMemo } from "react";
import { Code } from "@/entities/dictionaries/types/dictionary.types";
import { useDictionaryContext } from "@/entities/properties/components/context/dictionary.context";
import { useInitialPropertyContext } from "@/entities/properties/components/context/initial-property.context";
import {
  covertPropertyFieldToDictionaryCode,
  PropertyMultiCodeField,
} from "@/entities/properties-sale-rent/types/property.type";
import { generateInputId } from "@/utils";

export type MultiCodeOption = {
  value: Code;
  label: string;
};

export type MultiCodeFieldState = {
  inputId: string;
  initialValues: Code[];
  options: MultiCodeOption[];
  title: string | undefined;
  subtitle: string | undefined;
  toggleValue: (value: Code | null | undefined, checked: boolean) => void;
  setValues: (values: Code[]) => void;
};

export const useMultiCodeField = ({
  field,
  locale,
  variant = "",
}: {
  field: PropertyMultiCodeField;
  locale: string;
  variant?: string;
}): MultiCodeFieldState => {
  const { dictionariesByCode, entriesByDictionaryCode } = useDictionaryContext();
  const { initialProperty, updateProperty } = useInitialPropertyContext();

  const result = useMemo((): MultiCodeFieldState => {
    const dictionaryCode = covertPropertyFieldToDictionaryCode[field];
    const dictionary = dictionariesByCode[dictionaryCode];
    const entries = entriesByDictionaryCode[dictionaryCode];
    const inputId = generateInputId("property-multi-code", initialProperty.id, field, variant, locale);

    const initialValues: Code[] = (initialProperty[field] as Code[]) || [];
    const options: MultiCodeOption[] = entries.map((entry) => ({
      value: entry.code as Code,
      label: entry.name?.[locale] || entry.code || "",
    }));

    const title = dictionary?.name?.[locale] || dictionary?.code || "";
    const subtitle = dictionary?.description?.[locale] || "";

    const toggleValue = (value: Code | null | undefined, checked: boolean) => {
      if (!value) return;
      updateProperty((draft) => {
        const currentValues = (draft[field] as Code[]) || [];
        draft[field] = checked ? [...currentValues, value] : currentValues.filter((v) => v !== value);
      });
    };
    const setValues = (values: Code[]) => {
      updateProperty((draft) => {
        draft[field] = values;
      });
    };

    return { inputId, initialValues, options, title, subtitle, toggleValue, setValues };
  }, [initialProperty, dictionariesByCode, entriesByDictionaryCode, field, variant, locale, updateProperty]);

  return result;
};
