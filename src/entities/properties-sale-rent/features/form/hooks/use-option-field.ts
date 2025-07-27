"use client";
import { useState, useCallback, useTransition } from "react";
import { FormOption, FormSingleOptionProps } from "@/components/form";
import { DBSerialID } from "@/entities/common/";
import { DBDictionary } from "@/entities/dictionaries";
import { useDictionaryFormStoreActions } from "@/entities/dictionaries/features/form/store";
import { insertNewEntry } from "@/entities/dictionaries/libs/actions/entries";
import { DBDictionaryInsertEntry } from "@/entities/dictionaries/libs/actions/entries-action.types";
import {
  DBPropertyCodeField,
  usePropertyFormStoreActions,
  usePropertyFormStaticStore,
} from "@/entities/properties-sale-rent/";
import { useDictionaryOptions } from "./utils/use-dictionary-options";

export type OptionFieldState = FormSingleOptionProps & {
  inputId: string;
  title: string | undefined;
  description: string | undefined;
  error?: string | undefined;
  dictionary: DBDictionary | undefined;
};

export const useOptionField = ({ field }: { field: DBPropertyCodeField }): OptionFieldState => {
  const { inputId, options, title, description, locale, dictionary, entries, entryToDropDownOption } =
    useDictionaryOptions({
      field,
    });

  const { addEntry } = useDictionaryFormStoreActions();

  const { property } = usePropertyFormStaticStore();
  const { updateProperty } = usePropertyFormStoreActions();

  const [currentValue, setCurrentValue] = useState<DBSerialID | null>(property[field] as DBSerialID);

  // Get selected option
  const selectedEntry = currentValue ? entries?.[currentValue] : null;
  const selectedOption = selectedEntry ? entryToDropDownOption(selectedEntry) : null;

  // Set value
  const setValue = useCallback(
    (value: DBSerialID) => {
      console.log("addinng new value:", value);

      setCurrentValue(value);
      updateProperty((draft) => {
        draft[field] = value;
      });
    },
    [updateProperty, field],
  );

  const selectOption = useCallback((option: FormOption) => setValue(Number(option.key) as DBSerialID), [setValue]);

  const [isAddingOption, startTransition] = useTransition();

  const addOption = useCallback(
    (value: string | undefined) => {
      if (!value || !dictionary?.id) return;
      const insertingEntry: DBDictionaryInsertEntry = {
        dictionary_id: dictionary.id,
        name: { [locale]: value },
        is_active: true,
      };
      startTransition(async () => {
        const response = await insertNewEntry(insertingEntry);
        if (response.error) {
          console.error("Insert option error:", response.error);
          return;
        }

        const newEntry = response.data;
        if (newEntry) {
          console.log("addinng new netry:", newEntry);
          addEntry(newEntry);
          setValue(newEntry.id);
        }
      });
    },
    [dictionary?.id, locale, setValue, addEntry],
  );

  return {
    inputId,
    selectedOption,
    isAddingOption,
    options,
    selectOption,
    title,
    description,
    dictionary,
    addOption: { onClick: addOption },
  };
};
