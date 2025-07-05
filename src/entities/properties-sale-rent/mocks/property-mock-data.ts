import { createStore } from "zustand";
import { createPropertyStore, Property, PropertyStore, PropertyStoreApi } from "@/entities/properties-sale-rent/";

// Create standalone store (useful for tests and simple usage)
export function createStandalonePropertyStore(initialProperties: Record<number, Property> = {}): PropertyStoreApi {
  const store = createStore<PropertyStore>()(createPropertyStore);

  // Initialize with provided data
  if (Object.keys(initialProperties).length > 0) {
    store.setState({
      properties: initialProperties,
    });
  }

  return store;
}
