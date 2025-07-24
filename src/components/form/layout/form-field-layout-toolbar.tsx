import { memo } from "react";

export const FormFieldLayoutToolbar = memo(function FormFieldLayoutToolbar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="absolute top-2 right-3 flex items-center justify-end gap-2 opacity-20 transition-opacity duration-200 group-hover:opacity-100">
      {children}
    </div>
  );
});
