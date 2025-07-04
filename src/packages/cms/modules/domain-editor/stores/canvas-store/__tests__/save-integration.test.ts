/**
 * @fileoverview Save Integration Tests - End-to-End Save Workflow
 *
 * 🚨 CRITICAL: These tests simulate the complete save button workflow
 *
 * 🎯 PURPOSE: Test the full integration from save button click to server response
 *
 * 🔄 WORKFLOW TESTED:
 * 1. User makes changes in canvas store
 * 2. Save button extracts state and transforms data
 * 3. Server action receives correct parameters
 * 4. Success response triggers data refresh
 * 5. Store state is updated with fresh data
 *
 * 📋 INTEGRATION POINTS:
 * - Canvas store state management
 * - Save button data extraction logic
 * - Server action parameter transformation
 * - Post-save data refresh workflow
 * - Error handling and recovery
 *
 * 🔐 DATA SAFETY VALIDATION:
 * - No data loss during save process
 * - Proper error recovery
 * - State consistency after operations
 * - Correct server parameter formation
 */

import { saveProperties, getDomainProperties } from "@cms/modules/domain-editor/actions";
import { createCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store";
import { FormProperty } from "@cms/modules/properties/form/types";
import { Property, PropertyOption } from "@cms/modules/properties/property.types";

// Mock the server actions
jest.mock("@cms/modules/domain-editor/actions", () => ({
  saveProperties: jest.fn(),
  getDomainProperties: jest.fn(),
}));

const mockSaveProperties = saveProperties as jest.MockedFunction<typeof saveProperties>;
const mockGetDomainProperties = getDomainProperties as jest.MockedFunction<typeof getDomainProperties>;

describe("Save Integration - Complete Workflow", () => {
  // Generate unique domain ID for each test to prevent persistence pollution
  let testCounter = 0;
  const generateTestDomainId = (): string => `integration-test-${++testCounter}-${Date.now()}`;
  const testLocale = "en";

  // Helper to simulate the save button logic
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const simulateSaveButtonClick = async (store: ReturnType<typeof createCanvasStore>) => {
    // This replicates the exact logic from SaveButton component
    const state = store.getState();
    const { domainId, properties, options, sorting, dbProperties, deletedOptionIds } = state;

    // Calculate deleted property IDs by comparing with dbProperties
    const currentPropertyIds = new Set(Object.keys(properties));
    const deletedPropertyIds = dbProperties.filter((prop) => !currentPropertyIds.has(prop.id)).map((prop) => prop.id);

    // Convert properties to the format expected by the server action
    const propertiesToSave: Property[] = Object.entries(properties).map(([id, property]) => ({
      ...property,
      display_order: sorting[id] || 0,
      options: [], // Options are handled separately
    }));

    // Flatten options from nested structure to array
    const optionsToSave: PropertyOption[] = Object.entries(options).flatMap(([propertyId, propertyOptions]) =>
      Object.values(propertyOptions).map((option) => ({
        ...option,
        property_id: propertyId,
      })),
    );

    // Call the server action
    return await mockSaveProperties(domainId, propertiesToSave, optionsToSave, deletedPropertyIds, deletedOptionIds);
  };

  // Helper to create test property
  const createTestProperty = (id: string, overrides: Partial<Property> = {}): Property => ({
    id,
    group_id: null,
    name: { en: `Property ${id}` },
    description: { en: `Description for ${id}` },
    code: `prop_${id}`,
    is_locked: false,
    type: "text",
    meta: { type: "text" },
    is_required: false,
    is_private: false,
    is_new: false,
    display_order: 0,
    options: [],
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("🔄 Complete Success Workflow", () => {
    test("NEW PROPERTIES: Add properties → Save → Refresh → Verify complete cycle", async () => {
      // Initial state: empty
      const store = createCanvasStore(generateTestDomainId(), testLocale, []);

      // User adds new properties
      const newProp1: FormProperty = {
        id: "new-1",
        name: { en: "New Property 1" },
        type: "text",
        meta: { type: "text" },
        is_new: true,
        is_locked: false,
        is_required: false,
        is_private: false,
      };
      const newProp2: FormProperty = {
        id: "new-2",
        name: { en: "New Property 2" },
        type: "number",
        meta: { type: "number" },
        is_new: true,
        is_locked: false,
        is_required: false,
        is_private: false,
      };

      store.getState().addProperty(newProp1);
      store.getState().addProperty(newProp2);

      // Mock successful save
      mockSaveProperties.mockResolvedValue({ success: true, error: null });

      // Mock refresh data (properties now have server-assigned data)
      const refreshedProperties = [
        createTestProperty("new-1", { name: { en: "New Property 1" }, is_new: false }),
        createTestProperty("new-2", { name: { en: "New Property 2" }, type: "number", is_new: false }),
      ];
      mockGetDomainProperties.mockResolvedValue({ properties: refreshedProperties, error: null });

      // Simulate save button click
      const saveResult = await simulateSaveButtonClick(store);

      // Verify save was called with correct parameters
      expect(mockSaveProperties).toHaveBeenCalledWith(
        expect.any(String), // Domain ID (unique per test)
        expect.arrayContaining([
          expect.objectContaining({ id: "new-1", name: { en: "New Property 1" } }),
          expect.objectContaining({ id: "new-2", name: { en: "New Property 2" } }),
        ]),
        [], // No options
        [], // No deleted properties
        [], // No deleted options
      );

      expect(saveResult.success).toBe(true);

      // Simulate the refresh that happens after successful save
      const refreshResult = await mockGetDomainProperties(expect.any(String));
      if (refreshResult.properties) {
        store.getState().setup(refreshResult.properties);
      }

      // Verify store state after refresh
      const finalState = store.getState();
      expect(finalState.dbProperties).toHaveLength(2);
      expect(finalState.properties).toHaveProperty("new-1");
      expect(finalState.properties).toHaveProperty("new-2");
      expect(finalState.hasChanged).toBe(false); // Should be reset after save
    });

    test("MIXED OPERATIONS: Complex scenario → Save → Verify all operations processed", async () => {
      // Use unique domain ID to prevent test pollution
      const uniqueDomainId = `mixed-test-${Date.now()}`;

      // Initial state with 3 properties
      const initialProps = [
        createTestProperty("existing-1"),
        createTestProperty("existing-2"),
        createTestProperty("to-delete"),
      ];
      const store = createCanvasStore(uniqueDomainId, testLocale, initialProps);

      // User performs multiple operations
      // 1. Update existing property
      store.getState().updateProperty("existing-1", (draft) => {
        draft.name = { en: "Updated Property 1" };
        draft.is_required = true;
      });

      // 2. Add new property
      const newProp: FormProperty = {
        id: "new-prop",
        name: { en: "Brand New Property" },
        type: "option",
        meta: { type: "option", multi: true },
        is_new: true,
        is_locked: false,
        is_required: false,
        is_private: false,
      };
      store.getState().addProperty(newProp);

      // 3. Add options to new property
      store.getState().addPropertyOption("new-prop", { en: "Option 1" });
      store.getState().addPropertyOption("new-prop", { en: "Option 2" });

      // 4. Delete existing property
      store.getState().deleteProperty("to-delete");

      // 5. Reorder properties
      store.getState().reorderProperties(1, 0); // Move second to first

      // Mock successful save
      mockSaveProperties.mockResolvedValue({ success: true, error: null });

      // Simulate save
      await simulateSaveButtonClick(store);

      // Verify save was called with the domain ID
      expect(mockSaveProperties).toHaveBeenCalledWith(
        uniqueDomainId,
        expect.any(Array), // Properties array
        expect.any(Array), // Options array
        expect.arrayContaining(["to-delete"]), // Deleted property
        expect.any(Array), // Deleted options
      );

      // Get the actual call to verify parameters structure
      const saveCall = mockSaveProperties.mock.calls[0];
      const [domainId, properties, options, deletedProps] = saveCall;

      expect(domainId).toBe(uniqueDomainId);
      expect(Array.isArray(properties)).toBe(true);
      expect(Array.isArray(options)).toBe(true);
      expect(deletedProps).toContain("to-delete");

      // Should have 2 remaining properties + 1 new
      expect(properties).toHaveLength(3);

      // Verify properties exist (IDs may be different due to sorting)
      const propertyIds = properties.map((p: Property) => p.id);
      expect(propertyIds).toContain("existing-1");
      expect(propertyIds).toContain("existing-2");
      expect(propertyIds).toContain("new-prop");

      // Verify options were included
      expect(options).toHaveLength(2);
      const optionNames = options.map((o: PropertyOption) => o.name?.en);
      expect(optionNames).toContain("Option 1");
      expect(optionNames).toContain("Option 2");
    });
  });

  describe("❌ Error Handling", () => {
    test("SAVE ERROR: Server error → Should preserve store state", async () => {
      const uniqueDomainId = generateTestDomainId();
      const initialProps = [createTestProperty("prop-1")];
      const store = createCanvasStore(uniqueDomainId, testLocale, initialProps);

      // Verify initial state
      console.log("🔍 Initial state properties:", Object.keys(store.getState().properties));
      expect(store.getState().properties["prop-1"]).toBeDefined();

      // User makes changes
      store.getState().updateProperty("prop-1", (draft) => {
        draft.name = { en: "Modified Property" };
      });

      // Verify property exists after update
      console.log("🔍 After update properties:", Object.keys(store.getState().properties));
      expect(store.getState().properties["prop-1"]).toBeDefined();
      expect(store.getState().properties["prop-1"]?.name?.en).toBe("Modified Property");

      // Mock save failure
      mockSaveProperties.mockResolvedValue({
        success: false,
        error: "Database connection failed",
      });

      // Simulate save
      const result = await simulateSaveButtonClick(store);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Database connection failed");

      // Verify store state is preserved after error
      const stateAfterError = store.getState();
      console.log("🔍 After error properties:", Object.keys(stateAfterError.properties));

      // The property should still exist and have the modified name
      expect(stateAfterError.properties["prop-1"]).toBeDefined();
      expect(stateAfterError.properties["prop-1"]?.name?.en).toBe("Modified Property");
      expect(stateAfterError.hasChanged).toBe(true); // Should still be marked as changed
    });

    test("REFRESH ERROR: Save succeeds but refresh fails → Should handle gracefully", async () => {
      const store = createCanvasStore(generateTestDomainId(), testLocale, []);

      // Add new property
      const newProp: FormProperty = {
        id: "new-1",
        name: { en: "New Property" },
        type: "text",
        meta: { type: "text" },
        is_new: true,
        is_locked: false,
        is_required: false,
        is_private: false,
      };
      store.getState().addProperty(newProp);

      // Mock successful save but failed refresh
      mockSaveProperties.mockResolvedValue({ success: true, error: null });
      mockGetDomainProperties.mockResolvedValue({
        properties: null,
        error: "Failed to fetch updated data",
      });

      // Simulate save
      const saveResult = await simulateSaveButtonClick(store);
      expect(saveResult.success).toBe(true);

      // Simulate refresh attempt
      const refreshResult = await mockGetDomainProperties(expect.any(String));
      expect(refreshResult.error).toBe("Failed to fetch updated data");

      // Store should still contain the changes even if refresh failed
      const state = store.getState();
      expect(state.properties["new-1"]).toBeDefined();
    });
  });

  describe("🔄 State Transitions", () => {
    test("HASCHANGED FLAG: Modifications → Save → Should reset hasChanged", async () => {
      const uniqueDomainId = generateTestDomainId();
      const initialProps = [createTestProperty("prop-1")];
      const store = createCanvasStore(uniqueDomainId, testLocale, initialProps);

      // Initial state should not have changes
      expect(store.getState().hasChanged).toBe(false);

      // Make changes
      store.getState().updateProperty("prop-1", (draft) => {
        draft.name = { en: "Modified" };
      });

      // Debug: Check state after modification
      const stateAfterMod = store.getState();
      console.log("🔍 After modification:");
      console.log("  - hasChanged:", stateAfterMod.hasChanged);
      console.log(
        "  - dbProperties:",
        stateAfterMod.dbProperties.map((p) => ({ id: p.id, name: p.name })),
      );
      console.log(
        "  - properties:",
        Object.entries(stateAfterMod.properties).map(([id, p]) => ({ id, name: p.name })),
      );

      // Should be marked as changed
      expect(store.getState().hasChanged).toBe(true);

      // Mock successful save and refresh
      mockSaveProperties.mockResolvedValue({ success: true, error: null });
      const refreshedProps = [createTestProperty("prop-1", { name: { en: "Modified" } })];
      mockGetDomainProperties.mockResolvedValue({ properties: refreshedProps, error: null });

      // Save and refresh
      await simulateSaveButtonClick(store);
      const refreshResult = await mockGetDomainProperties(uniqueDomainId);
      if (refreshResult.properties) {
        store.getState().setup(refreshResult.properties);
      }

      // Should no longer be marked as changed after successful save
      expect(store.getState().hasChanged).toBe(false);
    });

    test("DELETED TRACKING: Delete operations → Save → Should clear deleted tracking", async () => {
      const uniqueDomainId = generateTestDomainId();
      const initialProps = [createTestProperty("prop-1"), createTestProperty("prop-2")];
      const store = createCanvasStore(uniqueDomainId, testLocale, initialProps);

      // Delete property
      store.getState().deleteProperty("prop-1");

      // Should track deletion
      const stateBeforeSave = store.getState();
      expect(stateBeforeSave.deletedPropertyIds).toContain("prop-1");

      // Mock successful save and refresh
      mockSaveProperties.mockResolvedValue({ success: true, error: null });
      const refreshedProps = [createTestProperty("prop-2")]; // Only remaining property
      mockGetDomainProperties.mockResolvedValue({ properties: refreshedProps, error: null });

      // Save and refresh
      await simulateSaveButtonClick(store);
      const refreshResult = await mockGetDomainProperties(uniqueDomainId);
      if (refreshResult.properties) {
        store.getState().setup(refreshResult.properties);
      }

      // Deleted tracking should be cleared after successful save
      const stateAfterSave = store.getState();
      expect(stateAfterSave.deletedPropertyIds).toHaveLength(0);
      expect(stateAfterSave.deletedOptionIds).toHaveLength(0);
    });
  });

  describe("📊 Data Consistency Validation", () => {
    test("PARAMETER CONSISTENCY: Complex scenario → Verify parameter integrity", async () => {
      const uniqueDomainId = generateTestDomainId();
      const initialProps = [createTestProperty("existing-1")];
      const store = createCanvasStore(uniqueDomainId, testLocale, initialProps);

      // Complex operations
      store.getState().updateProperty("existing-1", (draft) => {
        draft.type = "option";
        draft.meta = { type: "option", multi: false };
      });

      store.getState().addPropertyOption("existing-1", { en: "New Option" });

      const newProp: FormProperty = {
        id: "new-prop",
        name: { en: "New Property" },
        type: "text",
        meta: { type: "text" },
        is_new: true,
        is_locked: false,
        is_required: false,
        is_private: false,
      };
      store.getState().addProperty(newProp);

      mockSaveProperties.mockResolvedValue({ success: true, error: null });

      await simulateSaveButtonClick(store);

      const saveCall = mockSaveProperties.mock.calls[0];
      const [domainId, properties, options] = saveCall;

      // Verify parameter structure
      expect(domainId).toBe(uniqueDomainId);
      expect(Array.isArray(properties)).toBe(true);
      expect(Array.isArray(options)).toBe(true);

      // Debug: Log the actual properties to see what we're getting
      console.log(
        "🔍 Saved properties:",
        properties.map((p: Property) => ({
          id: p.id,
          type: p.type,
          meta: p.meta,
        })),
      );

      // Verify property-option relationships
      const optionProperty = properties.find((p: Property) => p.id === "existing-1");
      const newOption = options.find((o: PropertyOption) => o.name?.en === "New Option" && o.is_new);

      // Debug: Check what we actually got
      console.log("🔍 Option property:", optionProperty);
      console.log("🔍 New option:", newOption);

      expect(optionProperty?.type).toBe("option");
      expect(newOption?.property_id).toBe("existing-1");
      expect(newOption?.is_new).toBe(true);
    });
  });
});
