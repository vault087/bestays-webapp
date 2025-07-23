import { memo } from "react";

const FormFieldLayoutToolbar = memo(function FormFieldLayoutToolbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute top-3 right-3 flex items-center justify-end gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
      {children}
    </div>
  );
});

export default FormFieldLayoutToolbar;
