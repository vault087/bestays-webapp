import { ReactNode, createContext, useContext } from "react";
import { DictionaryStoreApi } from "@/entities/dictionaries/stores/dictionary.store";

// Create context with proper type safety
export const DictionaryStoreContext = createContext<DictionaryStoreApi | null>(null);

// Store Provider props
export interface DictionaryStoreProviderProps {
  children: ReactNode;
  store: DictionaryStoreApi;
}

// Store Provider component
export const DictionaryStoreProvider = ({ children, store }: DictionaryStoreProviderProps) => {
  return <DictionaryStoreContext.Provider value={store}>{children}</DictionaryStoreContext.Provider>;
};

// Context hook
export function useDictionaryStoreContext(): DictionaryStoreApi {
  const context = useContext(DictionaryStoreContext);
  if (!context) {
    throw new Error("useDictionaryStoreContext must be used within a DictionaryStoreProvider");
  }
  return context;
}
