import { usePropertyStore } from "@/entities/properties-sale-rent";

export function usePropertyStoreHydration(): boolean {
  return usePropertyStore((state) => state.hasHydrated);
}
