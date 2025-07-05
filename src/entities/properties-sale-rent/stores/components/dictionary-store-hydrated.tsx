import { ReactNode } from "react";
import {
  useDictionaryStoreContext,
  DictionaryStoreProvider,
  useDictionaryStoreHydration,
} from "@/entities/dictionaries";

// Simple helper like ClientOnly but for hydration
export function DictionaryStoreHydrated({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const hasHydrated = useDictionaryStoreHydration();
  const store = useDictionaryStoreContext();

  if (!hasHydrated) {
    return <>{fallback}</>;
  }

  return <DictionaryStoreProvider store={store}>{children}</DictionaryStoreProvider>;
}
