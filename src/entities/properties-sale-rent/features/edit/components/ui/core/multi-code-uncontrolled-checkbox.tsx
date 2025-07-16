"use client";
import {
  DBPropertyMultiCodeField,
  useMultiCodeField,
  MultiCodeOption,
  PropertyFieldHeader,
  PropertyFieldFooter,
} from "@/entities/properties-sale-rent/";
import { Checkbox, Label } from "@/modules/shadcn/";
import { useDebugRender } from "@/utils/use-debug-render";

export function MultiCodeUncontrolledCheckbox({ field }: { field: DBPropertyMultiCodeField }) {
  const { currentValues, options, title, subtitle, toggleValue } = useMultiCodeField({
    field,
    variant: "checkbox",
  });
  useDebugRender("Checkbox" + title);

  return (
    <div className="flex flex-col space-y-2">
      <PropertyFieldHeader text={title} />
      <div className="grid grid-cols-2 gap-2">
        {options.map((option: MultiCodeOption) => (
          <div className="flex items-center gap-2" key={option.code}>
            <Checkbox
              id={option.inputId}
              checked={currentValues.includes(option.code || "")}
              onCheckedChange={(checked) => {
                toggleValue(option.code, checked as boolean);
              }}
            />
            <Label htmlFor={option.inputId}>{option.label}</Label>
          </div>
        ))}
      </div>
      <PropertyFieldFooter text={subtitle} />
    </div>
  );
}
