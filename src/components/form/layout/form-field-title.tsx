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
  const textClassName = cn(
    "font-open-sans  text-foreground/80 ",
    variant === "h1" ? "text-md font-bold" : "font-semibold text-sm",
    className,
  );
  return (
    <>
      {inputId && (
        <Label className={textClassName} htmlFor={inputId}>
          {text}
        </Label>
      )}
      {!inputId && <span className={textClassName}>{text}</span>}
    </>
  );
}
