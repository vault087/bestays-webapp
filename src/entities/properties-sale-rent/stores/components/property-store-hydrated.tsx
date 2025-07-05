import { ReactNode } from "react";
import {
  PropertyStoreProvider,
  usePropertyStoreContext,
  usePropertyStoreHydration,
} from "@/entities/properties-sale-rent";

// Simple helper like ClientOnly but for hydration
export function PropertyStoreHydrated({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const hasHydrated = usePropertyStoreHydration();
  const store = usePropertyStoreContext();

  if (!hasHydrated) {
    return <>{fallback}</>;
  }

  return <PropertyStoreProvider store={store}>{children}</PropertyStoreProvider>;
}
