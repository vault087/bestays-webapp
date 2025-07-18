"use client";
import { useState } from "react";
import { DBSerialID } from "@/entities/common/";
import { useEntrySliceActions } from "@/entities/dictionaries/store/hooks";
import {
  DBPropertyMultiCodeField,
  useMultiOptionField,
  MultiOption,
  PropertyFieldHeader,
  PropertyFieldFooter,
  usePropertyLocale,
} from "@/entities/properties-sale-rent/";
import { Button, Checkbox, Input, Label } from "@/modules/shadcn/";
import { useDebugRender } from "@/utils/use-debug-render";

export function MultiOptionUncontrolledCheckbox({ field }: { field: DBPropertyMultiCodeField }) {
  const { currentValues, options, title, subtitle, toggleValue, dictionaryId } = useMultiOptionField({
    field,
    variant: "checkbox",
  });
  useDebugRender("Checkbox" + title);

  return (
    <div className="flex flex-col space-y-2">
      <PropertyFieldHeader text={title} />
      <div className="grid grid-cols-2 gap-2">
        {options.map((option: MultiOption) => (
          <div className="flex items-center gap-2" key={option.key}>
            <Checkbox
              id={option.inputId}
              checked={currentValues.includes(option.key)}
              onCheckedChange={(checked) => {
                toggleValue(option.key, checked as boolean);
              }}
            />
            <Label htmlFor={option.inputId}>{option.label}</Label>
          </div>
        ))}
      </div>
      <AddEntryComponent dictionaryId={dictionaryId} toggleValue={toggleValue} />
      <PropertyFieldFooter text={subtitle} />
    </div>
  );
}

const AddEntryComponent = ({
  dictionaryId,
  toggleValue,
}: {
  dictionaryId: DBSerialID | undefined;
  toggleValue: (value: DBSerialID | null | undefined, checked: boolean) => void;
}) => {
  const [value, setValue] = useState("");
  const { addEntry } = useEntrySliceActions();
  const locale = usePropertyLocale();

  if (!dictionaryId) return;

  const handleAddEntry = () => {
    const name = {
      [locale]: value,
    };
    const entry = addEntry(dictionaryId, name);
    toggleValue(entry.id, true);
    setValue("");
  };

  return (
    <div className="flex items-center gap-2">
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button onClick={handleAddEntry}>Add</Button>
    </div>
  );
};
