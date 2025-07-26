"use client";

import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { memo } from "react";
import { cn } from "@/modules/shadcn/utils/cn";

export type SortDirection = "asc" | "desc" | "off";

interface SortIconProps {
  direction: SortDirection;
  className?: string;
  size?: number;
}

export const SortIcon = memo(function SortIcon({ direction, className, size = 4 }: SortIconProps) {
  const iconSize = `h-${size} w-${size}`;

  switch (direction) {
    case "asc":
      return <ArrowUp className={cn(iconSize, "opacity-60 transition-opacity hover:opacity-100", className)} />;
    case "desc":
      return <ArrowDown className={cn(iconSize, "opacity-60 transition-opacity hover:opacity-100", className)} />;
    case "off":
    default:
      return <ArrowUpDown className={cn(iconSize, "opacity-60 transition-opacity hover:opacity-100", className)} />;
  }
});
