import { useStore } from "zustand";
import { usePropertyStoreContext } from "@/entities/properties-sale-rent/stores/contexts/property-store.context";
import { PropertyStore, PropertyStoreActions } from "@/entities/properties-sale-rent/stores/property.store";
import { Property } from "@/entities/properties-sale-rent/types/property.type";

export function usePropertyStore<T>(selector: (state: PropertyStore) => T): T {
  const store = usePropertyStoreContext();
  return useStore(store, selector);
}

export function usePropertyActions(): PropertyStoreActions {
  const store = usePropertyStoreContext();
  return store.getState();
}

export function useProperty(id: string): Property | undefined {
  return usePropertyStore((state) => state.properties[id]);
}

export function usePropertyField<T extends keyof Property>(id: string, field: T): Property[T] | undefined {
  return usePropertyStore((state) => {
    return state.properties[id]?.[field];
  });
}
