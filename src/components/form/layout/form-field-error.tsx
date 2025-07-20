import { Label } from "@/modules/shadcn/components/ui/label";
import { cn } from "@/modules/shadcn/utils/cn";

export function FormFieldError({
  error,
  inputId,
  className = "",
}: {
  error: string | undefined | null;
  inputId: string;
  className?: string;
}) {
  if (!error) return null;

  return (
    <Label id={`${inputId}-error`} htmlFor={inputId} className={cn("text-xs text-red-500", className)}>
      {error}
    </Label>
  );
}
