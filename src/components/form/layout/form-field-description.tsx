import { Label } from "@/modules/shadcn/components/ui/label";
import { cn } from "@/modules/shadcn/utils/cn";

export function FormFieldDescription({
  text,
  inputId = undefined,
  className = "",
}: {
  text: string | undefined | null;
  inputId?: string | undefined;
  className?: string;
}) {
  if (!text) return null;
  return (
    <Label
      htmlFor={inputId}
      className={cn("font-montserrat text-muted-foreground text-xs", className)}
      role="region"
      aria-live="polite"
    >
      {text}
    </Label>
  );
}
