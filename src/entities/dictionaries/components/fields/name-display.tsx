"use client";

/**
 * @fileoverview Property Name Display - Reactive localized name display
 */
import { memo } from "react";
import { cn } from "@/modules/shadcn";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useNameDisplay } from "@cms/modules/properties/form/hooks";

export const NameDisplay = memo(function NameDisplay({
  fallback = "",
  className,
}: {
  fallback?: string;
  className?: string;
}) {
  useDebugRender("NameDisplay");
  const displayName = useNameDisplay() || fallback;

  return <span className={cn("truncate", className)}>{displayName}</span>;
});

NameDisplay.displayName = "NameDisplay";
