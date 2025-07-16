import { useStore } from "zustand";
import {
  usePropertyStoreContext,
  PropertyStoreState,
  PropertyStoreActions,
  Property,
} from "@/entities/properties-sale-rent/";

export function usePropertyActions(): PropertyStoreActions {
  const store = usePropertyStoreContext();
  return store.getState();
}

export function useCurrentProperties(): Property[] {
  const store = usePropertyStoreContext();
  return Object.values(store.getState().properties);
}

// usePropertyStore
export function usePropertyStore<T>(selector: (state: PropertyStoreState) => T): T {
  const store = usePropertyStoreContext();
  return useStore(store, selector as (state: unknown) => T);
}

export function useProperty(id: string): Property | undefined {
  return usePropertyStore((state) => state.properties[id]);
}

export function usePropertyField<T extends keyof Property>(id: string, field: T): Property[T] | undefined {
  return usePropertyStore((state) => {
    return state.properties[id]?.[field];
  });
}

export function usePropertyStoreHydration(): boolean {
  return usePropertyStore((state) => state.hasHydrated);
}
