import { createContext, useContext } from "react";
import { StoreApi, useStore } from "zustand";
import { useShallow } from "zustand/shallow";
import { DictionaryFormStore } from "@/entities/dictionaries/features/form/store/dictionary-form.store";

export const EditorStoreContext = createContext<StoreApi<DictionaryFormStore> | null>(null);

export const EditorStoreProvider = ({
  children,
  store,
}: {
  children: React.ReactNode;
  store: StoreApi<DictionaryFormStore>;
}) => {
  return <EditorStoreContext.Provider value={store}>{children}</EditorStoreContext.Provider>;
};

export function useEditorStoreContext(): StoreApi<DictionaryFormStore> {
  const context = useContext(EditorStoreContext);
  if (!context) {
    throw new Error("useStoreContext must be used within a StoreProvider");
  }
  return context;
}

export function useEditorStore<T>(selector: (state: DictionaryFormStore) => T): T | undefined {
  const store = useEditorStoreContext();
  return useStore(store, useShallow(selector));
}
