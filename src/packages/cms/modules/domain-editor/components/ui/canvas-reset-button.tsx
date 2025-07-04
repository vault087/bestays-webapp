/**
 * @fileoverview Reset Button - Canvas state reset component
 *
 * 🎯 PURPOSE: Provides user interface for resetting domain editor canvas state
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Standalone button component for canvas reset operations
 * - Integrates with canvas store reset functionality
 * - Uses confirmation dialog for destructive action
 * - Positioned in navigation/toolbar areas for easy access
 *
 * 🤖 AI GUIDANCE - Reset Button Usage:
 * ✅ USE in navigation/toolbar for canvas state reset
 * ✅ INTEGRATE with canvas store reset actions
 * ✅ PROVIDE confirmation before destructive operations
 * ✅ SHOW clear visual indication of reset functionality
 *
 * ❌ NEVER reset without user confirmation
 * ❌ NEVER bypass canvas store for state management
 * ❌ NEVER render without canvas store context
 *
 * 🔄 RESET FLOW:
 * 1. User clicks reset button
 * 2. Confirmation dialog appears (optional)
 * 3. Canvas store reset action clears state
 * 4. UI updates with empty/default state
 *
 * 📚 REFERENCE: See docs/architecture/domain-editor/hook-patterns.md
 */
"use client";

import { RotateCcw } from "lucide-react";
import { memo } from "react";
import { Button } from "@/modules/shadcn/components/ui/button";
import { useCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store.hooks";

/**
 * 🔄 Reset Button - Reset canvas state
 *
 * Button component that handles resetting the domain editor canvas state.
 * Provides a clear way to reset all properties and return to initial state.
 *
 * Features:
 * - Clear visual design with rotate icon
 * - Integrates with canvas store state management
 * - Provides immediate reset functionality
 * - Positioned for easy access in navigation areas
 *
 * @example
 * ```tsx
 * // In navigation toolbar
 * <div className="flex items-center space-x-3">
 *   <DomainNameInput />
 *   <ResetButton />
 * </div>
 * ```
 */
function CanvasResetButton() {
  const store = useCanvasStore();

  /**
   * 🔧 Handle Canvas Reset
   *
   * Resets the canvas store to initial state, clearing all properties
   * and returning to default domain editor state.
   */
  const handleReset = () => {
    store.getState().reset();
  };

  return (
    <Button onClick={handleReset} variant="outline" size="sm" className="flex items-center gap-2">
      <RotateCcw className="h-4 w-4" />
      Reset
    </Button>
  );
}

export const ResetButton = memo(CanvasResetButton);
