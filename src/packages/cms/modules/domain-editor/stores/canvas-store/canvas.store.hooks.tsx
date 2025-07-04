"use client";

import { useContext, ReactNode } from "react";
import { PropertyStoreProvider } from "@cms/modules/properties/form/contexts";
import { CanvasStoreContext } from "./canvas.store.context";

export function useCanvasStore() {
  const store = useContext(CanvasStoreContext);
  if (!store) {
    throw new Error("useCanvasStore must be used within a CanvasStoreProvider");
  }
  return store;
}

export function useCanvasStoreHydration(): boolean {
  const store = useCanvasStore();
  return store((state) => state.hasHydrated);
}

// Simple helper like ClientOnly but for hydration
export function CanvasStoreHydrated({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const hasHydrated = useCanvasStoreHydration();
  const store = useCanvasStore();

  if (!hasHydrated) {
    return <>{fallback}</>;
  }

  return <PropertyStoreProvider store={store}>{children}</PropertyStoreProvider>;
}
