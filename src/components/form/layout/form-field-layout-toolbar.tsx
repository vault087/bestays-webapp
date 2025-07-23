import { Pencil, Expand } from "lucide-react";
import { memo } from "react";
import { Button } from "@/modules/shadcn/components/ui/button";

export const FormFieldLayoutToolbar = memo(function FormFieldLayoutToolbar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="absolute top-3 right-3 flex items-center justify-end gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
      {children}
    </div>
  );
});

export function FormFieldLayoutToolbarEditButton({ className, onClick }: { className?: string; onClick: () => void }) {
  return (
    <FormFieldLayoutToolbarButton className={className} onClick={onClick}>
      <Pencil size={16} className="text-muted-foreground/80" />
    </FormFieldLayoutToolbarButton>
  );
}

export function FormFieldLayoutToolbarExpandButton({
  className,
  onClick,
}: {
  className?: string;
  onClick: () => void;
}) {
  return (
    <FormFieldLayoutToolbarButton className={className} onClick={onClick}>
      <Expand size={16} className="text-muted-foreground/80" />
    </FormFieldLayoutToolbarButton>
  );
}

export function FormFieldLayoutToolbarButton({
  onClick,
  className,
  children,
}: {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Button variant="ghost" size="icon" className={className} onClick={onClick}>
      {children}
    </Button>
  );
}
