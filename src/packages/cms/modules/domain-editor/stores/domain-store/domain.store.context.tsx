/**
 * @fileoverview Domain Store Context - Provider for domain store
 *
 * 🎯 PURPOSE: Provides domain store context for domain editor
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Follows store context pattern from canvas-store
 * - Creates and provides domain store instance
 * - Fetches domain data from server
 *
 * 🤖 AI GUIDANCE - Context Usage Rules:
 * ✅ USE at top level of domain editor
 * ✅ ENSURE proper provider hierarchy (after CMSTranslationContextProvider)
 * ✅ PASS domainId for store initialization
 *
 * ❌ NEVER render without domainId
 * ❌ NEVER skip error handling for domain data fetching
 *
 * 📚 REFERENCE: See docs/architecture/domain-editor/hook-patterns.md
 */
"use client";

import { createContext, useEffect, useRef } from "react";
import { Domain } from "@cms/modules/domains/domain.types";
import { createDomainStore, DomainStoreType } from "./domain.store";

/**
 * 🎯 Domain Store Context - Provides domain store instance
 */
export const DomainStoreContext = createContext<DomainStoreType | null>(null);

/**
 * 🎁 Domain Store Provider Props
 */
export interface DomainStoreProviderProps {
  /** Domain ID for store initialization */
  domainId: string;
  /** Initial domain data from server */
  initialDomain: Domain | null;
  /** Child components */
  children: React.ReactNode;
}

/**
 * 🎁 Domain Store Provider - Creates and provides domain store
 *
 * Provider component that creates a domain store instance and
 * provides it to child components via context.
 *
 * @param domainId - Domain ID for store initialization
 * @param initialDomain - Initial domain data from server
 * @param children - Child components
 */
export function DomainStoreProvider({
  domainId,
  initialDomain,
  children,
}: DomainStoreProviderProps): React.JSX.Element {
  const storeRef = useRef<DomainStoreType | null>(null);

  // Create store instance if not exists
  if (!storeRef.current) {
    storeRef.current = createDomainStore(domainId, initialDomain);
  }

  // Update domain data if changed from server
  useEffect(() => {
    if (storeRef.current && initialDomain) {
      const currentOriginalDomain = storeRef.current.getState().originalDomain;

      // Only update if domain data has changed and there are no local changes
      if (JSON.stringify(currentOriginalDomain) !== JSON.stringify(initialDomain)) {
        storeRef.current.setState({
          domain: initialDomain,
          originalDomain: initialDomain,
        });
      }
    }
  }, [initialDomain]);

  return <DomainStoreContext.Provider value={storeRef.current}>{children}</DomainStoreContext.Provider>;
}
