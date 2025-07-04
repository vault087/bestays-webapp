"use client";

import React from "react";
import { cn } from "@/modules/shadcn";

interface PreviewPanelSheetProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * PreviewPanelSheet - Creates a sheet-like overlay panel for property previews
 *
 * Features:
 * - Absolute positioning to overlay the preview area
 * - Shadcn default styling (white background, shadow, rounded corners)
 * - Proper z-indexing for layering
 * - Covers entire preview section
 */
export function PreviewPanelSheet({ children, className }: PreviewPanelSheetProps): React.JSX.Element {
  return (
    <>
      {/* Background Panel - Absolute positioned overlay */}
      <div
        className={cn(
          // Position and size
          "absolute inset-2 z-10",
          // Shadcn default styling
          "rounded-lg border bg-white shadow-sm",
          // Ensure it doesn't interfere with interactions
          "pointer-events-none",
          className,
        )}
      />

      {/* Content Container - Higher z-index for interactions */}
      <div className="relative z-20 space-y-4 p-4">{children}</div>
    </>
  );
}
