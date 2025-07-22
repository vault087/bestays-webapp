"use client";
import { useState, useMemo, useCallback } from "react";
import { FormOption, FormSingleOptionProps } from "@/components/form";
import { DBSerialID } from "@/entities/common/";
import {
  DBPropertyCodeField,
  usePropertyFormStoreActions,
  usePropertyFormStaticStore,
} from "@/entities/properties-sale-rent/";
import { useDictionaryOptions } from "./utils/use-dictionary-options";

export type OptionFieldState = FormSingleOptionProps & {
  inputId: string;
  title: string | undefined;
  subtitle: string | undefined;
  error?: string | undefined;
};

export const useOptionField = ({ field }: { field: DBPropertyCodeField }): OptionFieldState => {
  const { inputId, options, title, subtitle, entries, entryToDropDownOption } = useDictionaryOptions({ field });

  const { property } = usePropertyFormStaticStore();
  const { updateProperty } = usePropertyFormStoreActions();

  const [currentValue, setCurrentValue] = useState<DBSerialID | null>(property[field] as DBSerialID);

  // Get selected option
  const selectedEntry = currentValue ? entries?.[currentValue] : null;
  const selectedOption = selectedEntry ? entryToDropDownOption(selectedEntry) : null;

  const addOption = useMemo(() => {
    return {
      label: "Add option",
      onClick: () => {
        console.log("add option");
      },
    };
  }, []);
  // Set value
  const setValue = useCallback(
    (value: DBSerialID) => {
      setCurrentValue(value);
      updateProperty((draft) => {
        draft[field] = value;
      });
    },
    [updateProperty, field],
  );
  const selectOption = useCallback((option: FormOption) => setValue(Number(option.key) as DBSerialID), [setValue]);

  return { inputId, selectedOption, options, selectOption, title, subtitle, addOption };
};
