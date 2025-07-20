import { Label } from "@/modules/shadcn/components/ui/label";
import { cn } from "@/modules/shadcn/utils/cn";

export function FormFieldDescription({
  id,
  text,
  inputId = undefined,
  className = "",
}: {
  id: string;
  text: string | undefined | null;
  inputId?: string | undefined;
  className?: string;
}) {
  if (!text) return null;
  return (
    <Label
      id={id}
      htmlFor={inputId}
      className={cn("font-open-sans text-muted-foreground text-xs", className)}
      role="region"
      aria-live="polite"
    >
      {text}
    </Label>
  );
}
