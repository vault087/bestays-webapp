import { Label } from "@/modules/shadcn/components/ui/label";
import { cn } from "@/modules/shadcn/utils/cn";

export function FormFieldError({
  error,
  inputId,
  className = "",
}: {
  error: string | undefined | null;
  inputId?: string | undefined;
  className?: string;
}) {
  if (!error) return null;
  const textClassName = cn("text-destructive text-xs", className);
  return (
    <>
      {inputId && (
        <Label id={`${inputId}-error`} className={textClassName} htmlFor={inputId}>
          {error}
        </Label>
      )}
      {!inputId && <span className={textClassName}>{error}</span>}
    </>
  );
}
