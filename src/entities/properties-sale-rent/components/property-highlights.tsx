import { useId } from "react";
import { usePropertyHighlights } from "@/entities/properties-sale-rent/hooks";
import { Label } from "@/modules/shadcn/components/ui/label";
import MultipleSelector, { Option } from "@/modules/shadcn/components/ui/multiselect";

export interface PropertyHighlightsProps {
  propertyId: string;
  locale?: string;
}

export function PropertyHighlights({ propertyId, locale = "en" }: PropertyHighlightsProps) {
  const id = useId();
  const { values, setValues, options, error, dictionaryExists } = usePropertyHighlights(propertyId, locale);

  // Convert our options to MultipleSelector format
  const multiselectOptions: Option[] = options.map((option) => ({
    value: option.code,
    label: option.label,
    ...(option.isInactive && { disable: option.isInactive }),
  }));

  // Convert selected values to Option format
  const selectedOptions: Option[] = values
    .map((code) => {
      const option = options.find((opt) => opt.code === code);
      if (!option) return null;

      const result: Option = {
        value: option.code,
        label: option.label,
      };

      if (option.isInactive) {
        result.disable = option.isInactive;
      }

      return result;
    })
    .filter((opt): opt is Option => opt !== null);

  const handleChange = (selectedOpts: Option[]) => {
    const codes = selectedOpts.map((opt) => opt.value);
    setValues(codes);
  };

  if (!dictionaryExists) {
    return (
      <div className="space-y-2">
        <Label htmlFor={id} className="text-destructive">
          Highlights Dictionary Not Found
        </Label>
        <p className="text-muted-foreground text-sm">
          The highlights dictionary is not available. Please contact support.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        Property Highlights
        {error && <span className="text-destructive ml-1">*</span>}
      </Label>
      <MultipleSelector
        commandProps={{
          label: "Select highlights",
        }}
        value={selectedOptions}
        defaultOptions={multiselectOptions}
        onChange={handleChange}
        placeholder="Select property highlights"
        hideClearAllButton={false}
        hidePlaceholderWhenSelected={true}
        emptyIndicator={<p className="text-center text-sm">No highlights found</p>}
        className={error ? "border-destructive" : ""}
        maxSelected={10} // Reasonable limit
        onMaxSelected={(limit) => {
          console.warn(`Maximum ${limit} highlights can be selected`);
        }}
      />
      {error && (
        <p className="text-destructive text-sm" role="alert" aria-live="polite">
          {error}
        </p>
      )}
      {values.length > 0 && (
        <p className="text-muted-foreground text-xs">
          {values.length} highlight{values.length !== 1 ? "s" : ""} selected
        </p>
      )}
    </div>
  );
}
