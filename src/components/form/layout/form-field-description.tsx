import { Label } from "@/modules/shadcn/components/ui/label";
import { cn } from "@/modules/shadcn/utils/cn";

export function FormFieldDescription({
  text,
  inputId,
  className = "",
}: {
  text: string | undefined | null;
  inputId: string;
  className?: string;
}) {
  if (!text) return null;
  return (
    <Label
      id={`${inputId}-description`}
      htmlFor={inputId}
      className={cn("font-open-sans text-muted-foreground text-", className)}
      role="region"
      aria-live="polite"
    >
      {text}
    </Label>
  );
}
