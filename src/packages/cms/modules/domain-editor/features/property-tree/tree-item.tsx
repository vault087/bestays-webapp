/**
 * @fileoverview Tree Item Components - Clickable tree items with reactive names
 *
 * 🎯 PURPOSE: Tree navigation components for the canvas property tree
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - TreeItem: Handles click navigation to property editor
 * - TreeItemName: REACTIVE display of current property name
 * - Uses scroll-to and focus for better UX
 * - Memoized for performance in large property lists
 *
 * 🤖 AI GUIDANCE - Component Usage:
 * ✅ TreeItem: Wrapper with navigation behavior
 * ✅ TreeItemName: Uses usePropertyDisplay for reactive updates
 * ✅ Proper memoization to prevent unnecessary re-renders
 * ✅ Focus management for accessibility
 *
 * 🔧 RECENT FIX: TreeItemName now uses usePropertyDisplay instead of
 * usePropertyValue to ensure tree names update when properties change
 *
 * 📚 REFERENCE: See docs/architecture/domain-editor/hook-patterns.md
 */
"use client";

import { memo, useCallback } from "react";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useNameDisplay, useCodeDisplay } from "@cms/modules/properties/form";
import { usePropertyId } from "@cms/modules/properties/form/contexts";

/**
 * 🎯 Tree Item - Clickable navigation to property editor
 *
 * Provides click handler to focus and scroll to the corresponding property
 * editor when user clicks on tree item.
 */
export const TreeItem = memo(() => {
  useDebugRender("TreeItem");
  const propertyId = usePropertyId();

  /**
   * 🔍 Navigate to property editor on click
   */
  const handleClick = useCallback(() => {
    const element = document.querySelector(`#property-${propertyId}`);
    if (element) {
      const input = element.querySelector("input");
      input?.focus();
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [propertyId]);

  return (
    <button onClick={handleClick} className="text-left group-hover:cursor-pointer">
      <TreeItemName />
    </button>
  );
});

const TreeItemName = memo(function TreeItemName() {
  useDebugRender("TreeItemName");
  const displayName = useNameDisplay();
  const code = useCodeDisplay();
  const title = displayName || code || "Untitled Property";
  return <span className="text-muted-foreground truncate text-xs">{title}</span>;
});
TreeItemName.displayName = "TreeItemName";
TreeItem.displayName = "TreeItem";
