import { Label } from "@/modules/shadcn/components/ui/label";
import { cn } from "@/modules/shadcn/utils/cn";

export function FormFieldTitle({
  text,
  inputId = undefined,
  className = "",
  variant = "bold",
}: {
  text: string | undefined | null;
  inputId?: string | undefined;
  className?: string;
  variant?: "bold" | "normal";
}) {
  if (!text) return null;
  return (
    <Label
      htmlFor={inputId}
      className={cn("font-open-sans text-sm", variant === "bold" ? "font-semibold" : "font-normal", className)}
    >
      {text}
    </Label>
  );
}
