import { Label } from "@/modules/shadcn/components/ui/label";
import { cn } from "@/modules/shadcn/utils/cn";

export type FormFieldTitleVariant = "h1" | "h2";

export function FormFieldTitle({
  text,
  inputId = undefined,
  className = "",
  variant = "h1",
}: {
  text: string | undefined | null;
  inputId?: string | undefined;
  className?: string;
  variant?: FormFieldTitleVariant;
}) {
  if (!text) return null;
  return (
    <Label
      htmlFor={inputId}
      className={cn("font-open-sans font-semibold", variant === "h1" ? "text-md" : "text-sm", className)}
    >
      {text}
    </Label>
  );
}
