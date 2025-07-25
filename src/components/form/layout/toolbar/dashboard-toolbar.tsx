"use client";

import { memo, ReactNode } from "react";
import { cn } from "@/modules/shadcn/utils/cn";

export interface DashboardToolbarProps {
  children: ReactNode;
  sticky?: boolean;
  className?: string;
}

export const DashboardToolbar = memo(function DashboardToolbar({
  children,
  sticky = true,
  className,
}: DashboardToolbarProps) {
  return (
    <div
      className={cn(
        "bg-background flex h-16 w-full flex-shrink-0 items-center justify-between border-b px-6",
        sticky && "sticky top-0 z-40",
        className,
      )}
    >
      {children}
    </div>
  );
});
