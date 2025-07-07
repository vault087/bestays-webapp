import { useId } from "react";
import { usePropertyArea } from "@/entities/properties-sale-rent/hooks";
import { Label } from "@/modules/shadcn/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/modules/shadcn/components/ui/select";

export interface PropertyAreaProps {
  propertyId: string;
  locale?: string;
}

export function PropertyArea({ propertyId, locale = "en" }: PropertyAreaProps) {
  const id = useId();
  const { value, setValue, options, error, dictionaryExists } = usePropertyArea(propertyId, locale);

  if (!dictionaryExists) {
    return (
      <div className="space-y-2">
        <Label htmlFor={id} className="text-destructive">
          Area Dictionary Not Found
        </Label>
        <p className="text-muted-foreground text-sm">The area dictionary is not available. Please contact support.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        Property Area
        {error && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Select value={value || ""} onValueChange={(val) => setValue(val || undefined)}>
        <SelectTrigger id={id} className={error ? "border-destructive" : ""}>
          <SelectValue placeholder="Select area" />
        </SelectTrigger>
        <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
          {options.map((option) => (
            <SelectItem
              key={option.code}
              value={option.code}
              className={option.isInactive ? "text-muted-foreground bg-muted/50" : ""}
            >
              {option.label}
              {option.isInactive && <span className="ml-2 text-xs">(inactive)</span>}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-destructive text-sm" role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}
