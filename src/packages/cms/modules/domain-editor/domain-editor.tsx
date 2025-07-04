/**
 * @fileoverview Domain Editor - Main application component
 *
 * 🎯 PURPOSE: Root component for the domain property editor application
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Orchestrates all provider contexts in correct order
 * - Handles async property data loading with React 18 "use" hook
 * - Provides error boundaries for robust error handling
 * - Establishes locale context for internationalization
 * - Sets up store providers with proper initialization
 *
 * 🤖 AI GUIDANCE - Component Usage:
 * ✅ USE as root component for domain editing pages
 * ✅ PASS domain_id and propertiesPromise as props
 * ✅ HANDLE errors gracefully with fallback UI
 * ✅ WRAP in proper provider hierarchy (Translation → Layout → Canvas)
 *
 * ❌ NEVER render without required props
 * ❌ NEVER skip error handling for propertiesPromise
 * ❌ NEVER change provider order (affects context availability)
 *
 * 💡 PROVIDER HIERARCHY:
 * CMSTranslationContextProvider → LayoutStoreProvider → CanvasStoreProvider → DomainLayout
 *
 * 📚 REFERENCE: See docs/architecture/domain-editor/hook-patterns.md
 */
"use client";

import { useLocale } from "next-intl";
import { memo, use } from "react";
import { CMSTranslationContextProvider } from "@cms/i18n/use-cms-translation.hooks";
import { GetDomainResponse, GetPropertiesResponse } from "./actions";
import { DomainLayout } from "./components";
import { useDebugRender } from "./hooks/use-debug-render";
import { CanvasStoreProvider } from "./stores/canvas-store/canvas.store.context";
import { DomainStoreProvider } from "./stores/domain-store/domain.store.context";
import { LayoutStoreProvider } from "./stores/layout-store/layout.store.context";

/**
 * 🎯 Props for the main Domain Editor component
 */
interface DomainEditorProps {
  /** UUID of the domain being edited */
  domain_id: string;
  /** Promise containing property data for the domain */
  propertiesPromise: Promise<GetPropertiesResponse>;
  /** Promise containing domain data */
  domainPromise: Promise<GetDomainResponse>;
}

/**
 * 🏗️ Domain Editor - Main application component
 *
 * Root component that sets up all necessary contexts and providers for the domain editor.
 * Handles async property loading and provides proper error boundaries.
 *
 * @param domain_id - UUID of the domain to edit
 * @param propertiesPromise - Promise containing initial property data
 *
 * @example
 * ```tsx
 * <DomainEditor
 *   domain_id="domain-uuid-123"
 *   propertiesPromise={getDomainProperties("domain-uuid-123")}
 * />
 * ```
 */
export const DomainEditor = memo(function DomainEditor({
  domain_id,
  propertiesPromise,
  domainPromise,
}: DomainEditorProps) {
  useDebugRender("DomainEditor");
  const locale = useLocale();
  const { properties, error: propertiesError } = use(propertiesPromise);
  const { domain, error: domainError } = use(domainPromise);

  // ⚠️ Error handling for failed data loading
  if (propertiesError || domainError) {
    return <div>Error: {propertiesError || domainError || "Failed to load data"}</div>;
  }

  // 🎁 Provider hierarchy - order is critical for context availability
  return (
    <CMSTranslationContextProvider namespace="domain_editor">
      <LayoutStoreProvider locale={locale}>
        <DomainStoreProvider domainId={domain_id} initialDomain={domain}>
          <CanvasStoreProvider domainId={domain_id} locale={locale} initialProperties={properties ?? []}>
            <DomainLayout />
          </CanvasStoreProvider>
        </DomainStoreProvider>
      </LayoutStoreProvider>
    </CMSTranslationContextProvider>
  );
});
