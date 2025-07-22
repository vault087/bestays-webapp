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

  return (
    <div className={cn("text-destructive text-xs", className)}>
      {inputId && (
        <Label id={`${inputId}-error`} htmlFor={inputId}>
          {error}
        </Label>
      )}
      {!inputId && error}
    </div>
  );
}
