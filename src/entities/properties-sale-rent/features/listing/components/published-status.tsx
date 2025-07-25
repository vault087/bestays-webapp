import { Badge } from "@/modules/shadcn/components/ui/badge";
import { cn } from "@/modules/shadcn/utils/cn";

interface PublishedStatusProps {
  is_published: boolean | null;
}

export function PublishedStatus({ is_published }: PublishedStatusProps) {
  if (is_published === null) return null;

  return (
    <Badge
      variant={is_published ? "default" : "outline"}
      className={cn(
        "text-xs",
        is_published ? "bg-green-500 text-white hover:bg-green-600" : "bg-yellow-500 text-white hover:bg-yellow-600",
      )}
    >
      {is_published ? "Published" : "Pending"}
    </Badge>
  );
}
