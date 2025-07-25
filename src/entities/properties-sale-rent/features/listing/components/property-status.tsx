import { Badge } from "@/modules/shadcn/components/ui/badge";

interface PropertyStatusProps {
  rent_enabled: boolean | null;
  sale_enabled: boolean | null;
}

export function PropertyStatus({ rent_enabled, sale_enabled }: PropertyStatusProps) {
  if (!rent_enabled && !sale_enabled) return null;

  return (
    <div className="flex gap-1">
      {rent_enabled && (
        <Badge variant="default" className="text-xs">
          Rent
        </Badge>
      )}
      {sale_enabled && (
        <Badge variant="secondary" className="text-xs">
          Sale
        </Badge>
      )}
    </div>
  );
}
