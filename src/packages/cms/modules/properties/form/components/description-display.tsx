"use client";

/**
 * @fileoverview Property Description Display - Reactive localized description display
 */
import { memo } from "react";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useDescriptionDisplay } from "@cms/modules/properties/form/hooks";

export const DescriptionDisplay = memo(function DescriptionDisplay({ fallback = "" }: { fallback?: string }) {
  useDebugRender("DescriptionDisplay");
  const displayDescription = useDescriptionDisplay() || fallback;

  return <span className="truncate text-sm leading-relaxed text-gray-600">{displayDescription}</span>;
});

DescriptionDisplay.displayName = "DescriptionDisplay";
