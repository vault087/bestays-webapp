/**
 * @fileoverview Page Store Integration Tests
 */
import { createPageStore } from "@/app/[locale]/(protected)/cms-components/store";
import type { FormProperty } from "@cms/modules/properties/form/types";
import { createMockProperty } from "@cms/modules/shared/form/hooks/__tests__/mock-factories";

describe("PageStore Integration", () => {
  let store: ReturnType<typeof createPageStore>;
  let mockProperty: FormProperty;

  beforeEach(() => {
    store = createPageStore();
    mockProperty = createMockProperty({
      id: "test-property-1",
      code: "TEST001",
      name: { en: "Test Property" },
    });
  });

  describe("Store Composition", () => {
    it("should contain both hydration and property store functionality", () => {
      const state = store.getState();

      // Hydration functionality (persist middleware may auto-hydrate)
      expect(typeof state.hasHydrated).toBe("boolean");
      expect(typeof state.setHasHydrated).toBe("function");

      // Property store functionality
      expect(state.properties).toEqual({});
      expect(typeof state.addProperty).toBe("function");
      expect(typeof state.updateProperty).toBe("function");
      expect(typeof state.deleteProperty).toBe("function");
      expect(typeof state.cloneProperty).toBe("function");
    });

    it("should work with property store operations", () => {
      // Add property through the composed store
      store.getState().addProperty(mockProperty);

      const state = store.getState();
      expect(state.properties[mockProperty.id]).toEqual(mockProperty);
      expect(state.hasChanged).toBe(true);
    });

    it("should work with hydration functionality", () => {
      // Test hydration state management
      store.getState().setHasHydrated(true);

      const state = store.getState();
      expect(state.hasHydrated).toBe(true);
    });

    it("should maintain separation between hydration and property concerns", () => {
      // Add property and set hydration
      store.getState().addProperty(mockProperty);
      store.getState().setHasHydrated(true);

      const state = store.getState();

      // Both should work independently
      expect(state.hasHydrated).toBe(true);
      expect(state.properties[mockProperty.id]).toEqual(mockProperty);
      expect(state.hasChanged).toBe(true);
    });
  });

  describe("Store Abstraction", () => {
    it("should be compatible with PropertyStoreProvider interface", () => {
      // The store should be assignable to PropertyStoreApi
      const propertyActions = {
        addProperty: store.getState().addProperty,
        updateProperty: store.getState().updateProperty,
        deleteProperty: store.getState().deleteProperty,
        cloneProperty: store.getState().cloneProperty,
      };

      expect(typeof propertyActions.addProperty).toBe("function");
      expect(typeof propertyActions.updateProperty).toBe("function");
      expect(typeof propertyActions.deleteProperty).toBe("function");
      expect(typeof propertyActions.cloneProperty).toBe("function");
    });

    it("should initialize property state correctly", () => {
      const state = store.getState();

      // Property store state should be empty initially
      expect(state.properties).toEqual({});
      expect(state.sorting).toEqual({});
      expect(state.hasChanged).toBe(false);
      expect(state.deletedPropertyIds).toEqual([]);

      // Hydration state is managed by persist middleware
      expect(typeof state.hasHydrated).toBe("boolean");
    });
  });
});
