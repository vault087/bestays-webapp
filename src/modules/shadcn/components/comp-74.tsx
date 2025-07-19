"use client";

import { useId } from "react";
import { useCharacterLimit } from "@/modules/shadcn/hooks/use-character-limit";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export default function Component() {
  const id = useId();
  const maxLength = 180;
  const { value, setValue, characterCount } = useCharacterLimit({ maxLength });

  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Textarea with characters left</Label>
      <Textarea
        id={id}
        value={value}
        maxLength={maxLength}
        onChange={(e) => setValue(e.target.value)}
        aria-describedby={`${id}-description`}
      />
      <p
        id={`${id}-description`}
        className="text-muted-foreground mt-2 text-right text-xs"
        role="status"
        aria-live="polite"
      >
        <span className="tabular-nums">{maxLength - characterCount}</span> characters left
      </p>
    </div>
  );
}
