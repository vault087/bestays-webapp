import { Label } from "@/modules/shadcn/components/ui/label";

export function PropertyFieldFooter({
  text,
  inputId = undefined,
}: {
  text: string | undefined | null;
  inputId?: string | undefined;
}) {
  if (!text) return null;
  return (
    <Label htmlFor={inputId} className="text-muted-foreground text-xs" role="region" aria-live="polite">
      {text}
    </Label>
  );
}
