import { Label } from "@/modules/shadcn/components/ui/label";
import { cn } from "@/modules/shadcn/utils/cn";

export function PropertyFieldHeader({
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
    <Label htmlFor={inputId} className={cn("font-open-sans text-md items-center border-0 font-bold", className)}>
      {text}
    </Label>
  );
}
