import { Label } from "@/modules/shadcn/components/ui/label";

export function PropertyFieldHeader({
  text,
  inputId = undefined,
}: {
  text: string | undefined | null;
  inputId?: string | undefined;
}) {
  if (!text) return null;
  return (
    <Label htmlFor={inputId} className="font-open-sans text-md items-center border-0">
      {text}
    </Label>
  );
}
