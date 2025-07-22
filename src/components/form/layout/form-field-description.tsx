import { Label } from "@/modules/shadcn/components/ui/label";
import { cn } from "@/modules/shadcn/utils/cn";

export function FormFieldDescription({
  text,
  inputId,
  className = "",
}: {
  text: string | undefined | null;
  inputId?: string | undefined;
  className?: string;
}) {
  if (!text) return null;
  return (
    <div className={cn("font-open-sans text-muted-foreground text-xs", className)}>
      {inputId && (
        <Label id={`${inputId}-description`} htmlFor={inputId} role="region" aria-live="polite">
          {text}
        </Label>
      )}
      {!inputId && text}
    </div>
  );
}
