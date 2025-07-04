/**
 * @fileoverview Domain Layout - Main layout orchestrator for domain editor
 *
 * 🎯 PURPOSE: Central layout component that orchestrates all domain editor UI elements
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Hydration boundaries for selective client-side rendering
 * - Layout store integration for toggle state management
 * - Conditional rendering based on UI toggle states
 * - Canvas and navigation composition patterns
 *
 * 🤖 AI GUIDANCE - Layout Component Usage:
 * ✅ USE as main layout inside store providers
 * ✅ HANDLE hydration boundaries with ClientOnly wrapper
 * ✅ INTEGRATE with layout store for toggle states
 * ✅ COMPOSE canvas and navigation components
 *
 * ❌ NEVER render without proper store context
 * ❌ NEVER skip hydration boundaries
 * ❌ NEVER manage toggle state locally (use layout store)
 *
 * 🔄 HYDRATION STRATEGY:
 * - Uses ClientOnly for proper SSR/hydration handling
 * - Prevents hydration mismatches for toggle states
 * - Ensures consistent rendering across server/client
 *
 * 📚 REFERENCE: See docs/architecture/domain-editor/hook-patterns.md
 */
"use client";

import { memo } from "react";
import { PropertyCanvas } from "@cms/modules/domain-editor/canvas";
import { PropertyNavigation } from "@cms/modules/domain-editor/features/property-tree";
import { CanvasStoreHydrated, useCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store.hooks";
import { LayoutStoreHydrated, useLayoutStore } from "@cms/modules/domain-editor/stores/layout-store/layout.store.hooks";
import { LanguageSelectionBar } from "@cms/modules/domain-editor/toolbar/language-selection-bar";
import { CustomLocaleProvider } from "@cms/modules/localization/hooks";
import { DataConflictDialog } from "./data-conflict-dialog";
import { DomainEditorHeader } from "./domain-editor-header";

/**
 * 🏗️ Domain Layout - Main layout orchestrator
 *
 * Central component that manages the overall layout of the domain editor.
 * Handles hydration boundaries, integrates with layout store for UI state,
 * and composes the main canvas and navigation components.
 *
 * Uses ClientOnly wrapper to prevent hydration mismatches with toggle states
 * that are managed by the layout store.
 */
export const DomainLayout = memo(function DomainLayout() {
  const layoutStore = useLayoutStore();
  const showLanguageBar = layoutStore((state) => state.showLanguageBar);
  const showPropertiesTree = layoutStore((state) => state.showPropertiesTree);

  // Get resetKey to force re-render on canvas reset
  const canvasStore = useCanvasStore();
  const resetKey = canvasStore((state) => state.resetKey);
  const customTranslation = layoutStore((state) => state.currentTranslation);

  return (
    <div key={resetKey} className="flex h-dvh flex-col">
      {/* Global Data Conflict Dialog */}
      <CanvasStoreHydrated fallback={null}>
        <DataConflictDialog />
      </CanvasStoreHydrated>

      <div className="sticky top-0 z-50">
        <LayoutStoreHydrated>
          <DomainEditorHeader />
        </LayoutStoreHydrated>
      </div>

      <div className="bg-primary-foreground flex flex-1 overflow-hidden">
        {showPropertiesTree && (
          <div className="flex-none">
            <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 dark:hover:scrollbar-thumb-gray-500 mx-3 my-3 h-[calc(100%-1.5rem)] overflow-y-auto">
              <CanvasStoreHydrated fallback={<div className="animate-pulse p-4">Loading properties...</div>}>
                <LayoutStoreHydrated>
                  <PropertyNavigation />
                </LayoutStoreHydrated>
              </CanvasStoreHydrated>
            </div>
          </div>
        )}
        <div className="flex flex-1 flex-col">
          {showLanguageBar && (
            <div className="sticky top-0 z-40 w-full flex-none">
              <LanguageSelectionBar />
            </div>
          )}
          <div className="mt-3 flex-1 overflow-y-auto">
            <CanvasStoreHydrated fallback={<div className="animate-pulse p-8 text-center">Loading canvas...</div>}>
              <LayoutStoreHydrated>
                <CustomLocaleProvider customLocale={customTranslation}>
                  <PropertyCanvas />
                </CustomLocaleProvider>
              </LayoutStoreHydrated>
            </CanvasStoreHydrated>
          </div>
        </div>
      </div>
    </div>
  );
});
