"use client";
import { useState } from "react";
import { DBSerialID } from "@/entities/common/";
import { useEntrySliceGetState } from "@/entities/dictionaries/features/form/store/hooks";
import {
  DBPropertyMultiCodeField,
  useMultiOptionField,
  MultiOption,
  PropertyFieldHeader,
  PropertyFieldDecription,
  usePropertyLocale,
} from "@/entities/properties-sale-rent/";
import { Button, Checkbox, Input, Label } from "@/modules/shadcn/";
import { useDebugRender } from "@/utils/use-debug-render";

// Multi Code Uncontrolled Checkbox
export function PropertyHighlightsCheckbox() {
  return <MultiOptionCheckbox field="highlights" />;
}
export function PropertyLocationStrengthsCheckbox() {
  return <MultiOptionCheckbox field="location_strengths" />;
}
export function PropertyTransactionTypesCheckbox() {
  return <MultiOptionCheckbox field="transaction_types" />;
}
export function PropertyLandFeaturesCheckbox() {
  return <MultiOptionCheckbox field="land_features" />;
}
export function PropertyNearbyAttractionsCheckbox() {
  return <MultiOptionCheckbox field="nearby_attractions" />;
}
export function PropertyLandAndConstructionCheckbox() {
  return <MultiOptionCheckbox field="land_and_construction" />;
}

export function MultiOptionCheckbox({ field }: { field: DBPropertyMultiCodeField }) {
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
      <PropertyFieldDecription text={subtitle} />
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
  const { addEntry } = useEntrySliceGetState();
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
