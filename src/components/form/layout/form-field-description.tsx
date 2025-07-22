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
  const textClassName = cn("font-open-sans text-muted-foreground text-xs", className);
  return (
    <>
      {inputId && (
        <Label
          id={`${inputId}-description`}
          className={textClassName}
          htmlFor={inputId}
          role="region"
          aria-live="polite"
        >
          {text}
        </Label>
      )}
      {!inputId && <span className={textClassName}>{text}</span>}
    </>
  );
}
