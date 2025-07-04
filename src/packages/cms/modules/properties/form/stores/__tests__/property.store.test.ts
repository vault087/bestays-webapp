import { createStore, StoreApi } from "zustand";
import { createPropertyStore, PropertyStore } from "@cms/modules/properties/form/stores/property.store";
import type { FormProperty } from "@cms/modules/properties/form/types";
import { createMockProperty } from "@cms/modules/shared/form/hooks/__tests__/mock-factories";

describe("PropertyStore", () => {
  let store: StoreApi<PropertyStore>;

  beforeEach(() => {
    store = createStore<PropertyStore>(createPropertyStore);
  });

  describe("addProperty", () => {
    it("should add multiple properties and maintain correct length", () => {
      const property1 = createMockProperty({ id: "prop-1", name: { en: "Property 1" } });
      const property2 = createMockProperty({ id: "prop-2", name: { en: "Property 2" } });
      const property3 = createMockProperty({ id: "prop-3", name: { en: "Property 3" } });

      store.getState().addProperty(property1);
      store.getState().addProperty(property2);
      store.getState().addProperty(property3);

      const { properties, hasChanged } = store.getState();

      expect(Object.keys(properties)).toHaveLength(3);
      expect(properties["prop-1"]).toEqual(property1);
      expect(properties["prop-2"]).toEqual(property2);
      expect(properties["prop-3"]).toEqual(property3);
      expect(hasChanged).toBe(true);
    });

    it("should set is_new to true for new properties", () => {
      const property = createMockProperty({ id: "new-prop", is_new: true });

      store.getState().addProperty(property);

      const addedProperty = store.getState().properties["new-prop"];
      expect(addedProperty.is_new).toBe(true);
    });
  });

  describe("updateProperty", () => {
    it("should update property fields correctly", () => {
      const originalProperty = createMockProperty({
        id: "update-test",
        name: { en: "Original Name" },
        type: "text",
        is_required: false,
      });

      const expectedProperty: FormProperty = {
        ...originalProperty,
        name: { en: "Updated Name" },
        type: "number",
        is_required: true,
        meta: { type: "number", integer: true, min: 0, max: 100 },
      };

      // Add original property
      store.getState().addProperty(originalProperty);

      // Update the property
      store.getState().updateProperty("update-test", (draft: FormProperty) => {
        draft.name = { en: "Updated Name" };
        draft.type = "number";
        draft.is_required = true;
        draft.meta = { type: "number", integer: true, min: 0, max: 100 };
      });

      const updatedProperty = store.getState().properties["update-test"];
      expect(updatedProperty).toEqual(expectedProperty);
    });

    it("should not update non-existent property", () => {
      const initialState = store.getState();

      store.getState().updateProperty("non-existent", (draft: FormProperty) => {
        draft.name = { en: "Should not work" };
      });

      expect(store.getState().properties).toEqual(initialState.properties);
    });
  });

  describe("deleteProperty", () => {
    it("should delete properties and track deleted IDs correctly", () => {
      const existingProperty = createMockProperty({ id: "existing-1", is_new: false });
      const newProperty1 = createMockProperty({ id: "new-1", is_new: true });
      const newProperty2 = createMockProperty({ id: "new-2", is_new: true });
      const existingProperty2 = createMockProperty({ id: "existing-2", is_new: false });

      // Add all properties
      store.getState().addProperty(existingProperty);
      store.getState().addProperty(newProperty1);
      store.getState().addProperty(newProperty2);
      store.getState().addProperty(existingProperty2);

      // Delete almost all (keep only new-2)
      store.getState().deleteProperty("existing-1");
      store.getState().deleteProperty("new-1");
      store.getState().deleteProperty("existing-2");

      const { properties, deletedPropertyIds, hasChanged } = store.getState();

      // Only new-2 should remain
      expect(Object.keys(properties)).toHaveLength(1);
      expect(properties["new-2"]).toEqual(newProperty2);

      // Only existing properties should be in deletedPropertyIds
      expect(deletedPropertyIds).toEqual(["existing-1", "existing-2"]);
      expect(hasChanged).toBe(true);
    });

    it("should not track new properties in deletedPropertyIds", () => {
      const newProperty = createMockProperty({ id: "new-prop", is_new: true });

      store.getState().addProperty(newProperty);
      store.getState().deleteProperty("new-prop");

      const { properties, deletedPropertyIds } = store.getState();

      expect(Object.keys(properties)).toHaveLength(0);
      expect(deletedPropertyIds).toHaveLength(0);
    });
  });

  describe("cloneProperty", () => {
    it("should clone property with same fields except id", () => {
      const originalProperty = createMockProperty({
        id: "original-prop",
        name: { en: "Original Property" },
        type: "number",
        is_required: true,
        meta: { type: "number", integer: false, min: 10, max: 100 },
      });

      store.getState().addProperty(originalProperty);
      store.getState().cloneProperty("original-prop");

      const { properties, hasChanged } = store.getState();
      const propertyIds = Object.keys(properties);

      expect(propertyIds).toHaveLength(2);
      expect(hasChanged).toBe(true);

      const clonedProperty = Object.values(properties).find((p) => p.id !== "original-prop");
      expect(clonedProperty).toBeDefined();

      if (clonedProperty) {
        expect(clonedProperty.id).not.toBe(originalProperty.id);
        expect(clonedProperty.name).toEqual(originalProperty.name);
        expect(clonedProperty.type).toEqual(originalProperty.type);
        expect(clonedProperty.is_required).toEqual(originalProperty.is_required);
        expect(clonedProperty.meta).toEqual(originalProperty.meta);
        expect(clonedProperty.is_new).toBe(true);
      }
    });

    it("should not clone non-existent property", () => {
      const initialState = store.getState();

      store.getState().cloneProperty("non-existent");

      expect(store.getState().properties).toEqual(initialState.properties);
      expect(store.getState().hasChanged).toBe(false);
    });
  });
});
