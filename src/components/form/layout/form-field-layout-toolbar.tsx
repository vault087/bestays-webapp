import { memo } from "react";
import { cn } from "@/modules/shadcn/utils/cn";

export const FormFieldLayoutToolbar = memo(function FormFieldLayoutToolbar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute top-2 right-3 flex items-center justify-end gap-2 opacity-20 duration-200 group-hover:opacity-100",
        className,
      )}
    >
      {children}
    </div>
  );
});
