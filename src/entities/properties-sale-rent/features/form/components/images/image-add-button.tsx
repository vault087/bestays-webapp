import { ImagePlus } from "lucide-react";
import { memo } from "react";
import { cn } from "@/modules/shadcn";
import { Button } from "@/modules/shadcn/components/ui/button";

export const ImageAddButton = memo(function ImageAddButton({
  className,
  onClick,
  remainingCount,
  size = "sm",
}: {
  className?: string;
  onClick: () => void;
  remainingCount?: number;
  size?: "sm" | "md";
}) {
  return (
    <Button
      variant="outline"
      className={cn(
        "flex-shrink-0 border-dashed",
        size === "md" && "h-30 w-30",
        size === "sm" && "h-20 w-20",
        className,
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "text-muted-foreground flex flex-col items-center justify-center",
          size === "sm" && "space-y-1.5",
          size === "md" && "space-y-2",
        )}
      >
        <ImagePlus className={cn("", size === "sm" && "!h-6 !w-6", size === "md" && "!h-7 !w-7")} />
        {remainingCount && remainingCount > 0 && (
          // <div className="bg-muted flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-md">
          <span className={cn("text-xs select-none", size === "sm" && "text-xs", size === "md" && "text-sm")}>
            +{remainingCount}
          </span>
          // </div>
        )}
      </div>
    </Button>
  );
});
