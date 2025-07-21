import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/modules/shadcn/components/ui/tooltip";
import { useIsMobile } from "@/modules/shadcn/hooks/use-mobile";
import { cn } from "@/modules/shadcn/utils/cn";
export function QuickTooltip({
  content,
  children,
  delay = 200, // default delay in ms
  open,
  onOpenChange,
  className,
}: {
  content: React.ReactNode;
  children?: React.ReactNode;
  delay?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={delay} disableHoverableContent open={open} onOpenChange={onOpenChange}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side="top"
          align="center"
          style={{ pointerEvents: "none" }}
          // Hide on mobile devices that don't support hover
          className={cn("[@media(hover:none)]:hidden", className)}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
