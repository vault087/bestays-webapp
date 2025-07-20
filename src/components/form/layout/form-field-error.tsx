import { Label } from "@/modules/shadcn/components/ui/label";
import { cn } from "@/modules/shadcn/utils/cn";

export function FormFieldError({
  error,
  inputId = undefined,
  className = "",
}: {
  error: string | undefined | null;
  inputId?: string | undefined;
  className?: string;
}) {
  if (!error) return null;
  return (
    <Label htmlFor={inputId} className={cn("text-xs text-red-500", className)}>
      {error}
    </Label>
  );
}
