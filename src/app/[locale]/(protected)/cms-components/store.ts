import { createStore, StoreApi } from "zustand";
import { persist } from "zustand/middleware";
import { createPropertyStore, PropertyStore } from "@cms/modules/properties/form/stores/property.store";
import { FormProperty } from "@cms/modules/properties/form/types";

export type StoreHydration = {
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
};

export type PageStore = StoreHydration & PropertyStore;

export function createPageStore(): StoreApi<PageStore> {
  return createStore<PageStore>()(
    persist(
      (set, get, api) => ({
        hasHydrated: false,
        setHasHydrated: (hasHydrated: boolean) => set({ hasHydrated }),
        ...createPropertyStore(set, get, api),
      }),
      {
        name: "page-store",
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      },
    ),
  );
}
