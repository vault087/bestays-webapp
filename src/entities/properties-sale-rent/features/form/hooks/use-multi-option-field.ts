"use client";
import { useState, useCallback, useMemo } from "react";
import { FormOption, FormMultiOptionProps } from "@/components/form";
import { DBSerialID } from "@/entities/common/";
import { useDictionaryFormStoreActions } from "@/entities/dictionaries/features/form/store";
import {
  DBPropertyMultiCodeField,
  usePropertyFormStoreActions,
  usePropertyFormStaticStore,
  usePropertyLocale,
} from "@/entities/properties-sale-rent/";
import { useDictionaryOptions } from "./utils/use-dictionary-options";

export type MultiOptionFieldState = FormMultiOptionProps & {
  inputId: string;
  title: string | undefined;
  description: string | undefined;
  error?: string | undefined;
  selectedKeys: string[] | null;
};

export const useMultiOptionField = ({ field }: { field: DBPropertyMultiCodeField }): MultiOptionFieldState => {
  const { inputId, options, title, description, dictionary, entries, entryToDropDownOption } = useDictionaryOptions({
    field,
  });
  const { addEntry } = useDictionaryFormStoreActions();

  const { property } = usePropertyFormStaticStore();
  const { updateProperty } = usePropertyFormStoreActions();

  const [currentValues, setCurrentValues] = useState<DBSerialID[] | null>(property[field] as DBSerialID[]);
  const locale = usePropertyLocale();
  // Get selected option
  const selectedEntries = useMemo(() => {
    return entries ? Object.values(entries).filter((entry) => currentValues?.includes(entry.id)) : [];
  }, [entries, currentValues]);

  const selectedOptions = useMemo(
    () => selectedEntries.map((entry) => entryToDropDownOption(entry)),
    [selectedEntries, entryToDropDownOption],
  );

  const selectedKeys = useMemo(() => selectedOptions?.map((option) => option.key), [selectedOptions]);

  const selectOptions = useCallback(
    (options: FormOption[]) => {
      const values: DBSerialID[] = options.map((option) => Number(option.key));
      if (!values || values.length === 0) {
        return;
      }
      setCurrentValues(values);
      updateProperty((draft) => {
        draft[field] = values;
      });
    },
    [field, updateProperty],
  );

  // Set values
  const toggleOption = useCallback(
    (option: FormOption, checked: boolean) => {
      if (!option) return;
      const value = Number(option.key);
      const current = currentValues || []; // ← Access via ref
      const newValues = checked ? [...current, value] : current.filter((v) => v !== value);

      setCurrentValues(newValues);
      updateProperty((draft) => {
        draft[field] = newValues;
      });
    },
    [updateProperty, field, currentValues],
  );

  const addOption = useCallback(
    (value: string | undefined) => {
      if (!value || !dictionary?.id) return;
      const newEntry = addEntry(dictionary?.id, { [locale]: value });
      if (newEntry) {
        const current = currentValues || [];

        const newValues: DBSerialID[] = [...current, newEntry.id];
        setCurrentValues(newValues);
        updateProperty((draft) => {
          draft[field] = newValues;
        });
      }
    },
    [dictionary?.id, addEntry, locale, currentValues, updateProperty, field],
  );

  return {
    inputId,
    options,
    selectedOptions,
    selectOptions,
    selectedKeys,
    toggleOption,
    title,
    description,
    addOption: { onClick: addOption },
  };
};
