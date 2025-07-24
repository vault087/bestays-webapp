import { memo } from "react";
import { cn } from "@/modules/shadcn/utils/cn";

export const FormFieldPreview = memo(function FormFieldPreview({
  previewValue,
  className,
}: {
  previewValue: string;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full flex-row justify-end pr-2", className)}>
      <span className="text-muted-foreground text-sm font-light">{previewValue}</span>
    </div>
  );
});
