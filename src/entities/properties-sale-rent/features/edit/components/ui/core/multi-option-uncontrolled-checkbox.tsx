"use client";
import { useState } from "react";
import { DBSerialID } from "@/entities/common/";
import { useDictionaryActions } from "@/entities/dictionaries/";
import {
  DBPropertyMultiCodeField,
  useMultiCodeField,
  MultiOption,
  PropertyFieldHeader,
  PropertyFieldFooter,
  usePropertyLocale,
} from "@/entities/properties-sale-rent/";
import { Button, Checkbox, Input, Label } from "@/modules/shadcn/";
import { useDebugRender } from "@/utils/use-debug-render";

export function MultiOptionUncontrolledCheckbox({ field }: { field: DBPropertyMultiCodeField }) {
  const { currentValues, options, title, subtitle, toggleValue, dictionaryId } = useMultiCodeField({
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
      <AddEntryComponent dictionaryId={dictionaryId} />
      <PropertyFieldFooter text={subtitle} />
    </div>
  );
}

const AddEntryComponent = ({ dictionaryId }: { dictionaryId: DBSerialID | undefined }) => {
  const [value, setValue] = useState("");
  const { addEntry } = useDictionaryActions();
  const locale = usePropertyLocale();

  if (!dictionaryId) return;

  const handleAddEntry = () => {
    const name = {
      [locale]: value,
    };
    addEntry(dictionaryId, name);
  };

  return (
    <div className="flex items-center gap-2">
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button onClick={handleAddEntry}>Add</Button>
    </div>
  );
};
