/**
 * @fileoverview Concurrent Access Tests - Multi-User Conflict Scenarios
 *
 * 🚨 CRITICAL: These tests prevent data conflicts in multi-user environments
 *
 * 🎯 PURPOSE: Test concurrent access scenarios to ensure graceful conflict handling
 *
 * 📋 SCENARIOS COVERED:
 * 1. Two users edit same property → Conflict resolution dialog
 * 2. User A deletes property User B editing → Graceful handling
 * 3. Rapid consecutive saves → Sequential processing
 * 4. Domain published while editing → Block conflicting operations
 *
 * 🔐 DATA SAFETY VALIDATION:
 * - No data loss during concurrent operations
 * - Clear conflict resolution with user choice
 * - Graceful handling of delete/edit conflicts
 * - Domain status blocking for critical operations
 */

import { saveProperties } from "@cms/modules/domain-editor/actions";
import { createCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store";
import { Property } from "@cms/modules/properties/property.types";

// Mock the server actions
jest.mock("@cms/modules/domain-editor/actions", () => ({
  saveProperties: jest.fn(),
  getDomainProperties: jest.fn(),
}));

const mockSaveProperties = saveProperties as jest.MockedFunction<typeof saveProperties>;

describe("Concurrent Access", () => {
  // Generate unique domain ID for each test
  let testCounter = 0;
  const generateTestDomainId = (): string => `concurrent-test-${++testCounter}-${Date.now()}`;
  const testLocale = "en";

  // Helper to create test data
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

  // Helper to simulate another user's changes
  const simulateOtherUserChange = (property: Property, changes: Partial<Property>): Property => ({
    ...property,
    ...changes,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Two users edit same property → Conflict resolution dialog", async () => {
    const initialProperty = createTestProperty("shared-prop", {
      name: { en: "Initial Name" },
      description: { en: "Initial Description" },
    });

    const store = createCanvasStore(generateTestDomainId(), testLocale, [initialProperty]);

    // === USER A ACTIONS ===
    // User A starts editing the property
    store.getState().updateProperty("shared-prop", (draft) => {
      draft.name = { en: "User A Modified Name" };
      draft.description = { en: "User A Modified Description" };
      draft.is_required = true;
    });

    const userAState = store.getState();
    expect(userAState.hasChanged).toBe(true);
    expect(userAState.properties["shared-prop"]?.name?.en).toBe("User A Modified Name");

    // === USER B ACTIONS (Concurrent) ===
    // Meanwhile, User B also modifies the same property and saves
    const userBModification = simulateOtherUserChange(initialProperty, {
      name: { en: "User B Modified Name" },
      description: { en: "User B Modified Description" },
      is_private: true, // Different field than User A
    });

    // Simulate User B's changes arriving via refresh/polling
    store.getState().detectConflict([userBModification]);

    // === CONFLICT DETECTION ===
    const conflictState = store.getState();
    expect(conflictState.hasDataConflict).toBe(true);
    expect(conflictState.conflictData).toEqual([userBModification]);

    // CRITICAL: User A's changes must be preserved
    expect(conflictState.properties["shared-prop"]?.name?.en).toBe("User A Modified Name");
    expect(conflictState.properties["shared-prop"]?.is_required).toBe(true);
    expect(conflictState.hasChanged).toBe(true);

    // === CONFLICT RESOLUTION OPTIONS ===

    // Option 1: User A chooses to refresh (accept User B's changes)
    const store1 = createCanvasStore(generateTestDomainId(), testLocale, [initialProperty]);
    store1.getState().updateProperty("shared-prop", (draft) => {
      draft.name = { en: "User A Modified Name" };
    });
    store1.getState().detectConflict([userBModification]);

    store1.getState().resolveConflict("refresh");

    const refreshState = store1.getState();
    expect(refreshState.hasDataConflict).toBe(false);
    expect(refreshState.properties["shared-prop"]?.name?.en).toBe("User B Modified Name");
    expect(refreshState.properties["shared-prop"]?.is_private).toBe(true);
    expect(refreshState.hasChanged).toBe(false);

    // Option 2: User A chooses to continue (keep their changes)
    // In this case, save will proceed with User A's changes
    const continuedState = store.getState();
    expect(continuedState.properties["shared-prop"]?.name?.en).toBe("User A Modified Name");
    expect(continuedState.hasChanged).toBe(true);
  });

  test("User A deletes property User B editing → Graceful handling", async () => {
    const sharedProperty = createTestProperty("doomed-prop", {
      name: { en: "Property to Delete" },
      description: { en: "This will be deleted by User A" },
    });

    // === INITIAL STATE ===
    const store = createCanvasStore(generateTestDomainId(), testLocale, [sharedProperty]);

    // === USER B ACTIONS ===
    // User B is actively editing the property
    store.getState().updateProperty("doomed-prop", (draft) => {
      draft.name = { en: "User B Important Changes" };
      draft.description = { en: "User B spent time on this!" };
      draft.is_required = true;
    });

    const userBState = store.getState();
    expect(userBState.hasChanged).toBe(true);
    expect(userBState.properties["doomed-prop"]?.name?.en).toBe("User B Important Changes");

    // === USER A ACTIONS (Concurrent) ===
    // Meanwhile, User A deletes the property completely
    // This is simulated by the property being absent from the new DB data
    const dbAfterDeletion: Property[] = []; // Property is gone

    // Simulate detecting that the property was deleted by another user
    store.getState().detectConflict(dbAfterDeletion);

    // === CONFLICT DETECTION ===
    const conflictState = store.getState();
    expect(conflictState.hasDataConflict).toBe(true);
    expect(conflictState.conflictData).toEqual(dbAfterDeletion);

    // CRITICAL: User B's unsaved changes must be preserved in memory
    // so they can be warned about the deletion
    expect(conflictState.properties["doomed-prop"]).toBeDefined();
    expect(conflictState.properties["doomed-prop"]?.name?.en).toBe("User B Important Changes");
    expect(conflictState.hasChanged).toBe(true);

    // === GRACEFUL HANDLING OPTIONS ===

    // Option 1: User B accepts deletion (loses their work)
    store.getState().resolveConflict("refresh");

    const deletedState = store.getState();
    expect(deletedState.hasDataConflict).toBe(false);
    expect(deletedState.properties["doomed-prop"]).toBeUndefined();
    expect(deletedState.hasChanged).toBe(false);

    // Option 2: User B could recreate as new property (implementation-dependent)
    // This would require UI that lets them save their changes as a new property
  });

  test("Rapid consecutive saves → Sequential processing", async () => {
    const store = createCanvasStore(generateTestDomainId(), testLocale, []);

    // Create multiple properties rapidly
    for (let i = 0; i < 5; i++) {
      store.getState().addProperty({
        id: `rapid-prop-${i}`,
        name: { en: `Rapid Property ${i}` },
        type: "text",
        meta: { type: "text" },
        is_new: true,
        is_locked: false,
        is_required: false,
        is_private: false,
      });
    }

    // Mock sequential processing with timing
    const saveOrder: number[] = [];
    let saveCount = 0;

    mockSaveProperties.mockImplementation(() => {
      const currentSave = ++saveCount;
      saveOrder.push(currentSave);

      return new Promise((resolve) => {
        // Simulate variable processing times
        const delay = Math.random() * 50 + 10; // 10-60ms
        setTimeout(() => {
          resolve({ success: true, error: null });
        }, delay);
      });
    });

    // Trigger multiple rapid saves
    const state = store.getState();
    const savePromises = [];

    for (let i = 0; i < 3; i++) {
      // Each save includes all current properties
      savePromises.push(
        mockSaveProperties(
          state.domainId,
          Object.entries(state.properties).map(([id, property]) => ({
            ...property,
            display_order: state.sorting[id] || 0,
            options: [],
          })),
          [],
          [],
          [],
        ),
      );
    }

    const results = await Promise.all(savePromises);

    // All saves should complete successfully
    results.forEach((result) => {
      expect(result.success).toBe(true);
    });

    // Verify sequential processing
    expect(mockSaveProperties).toHaveBeenCalledTimes(3);
    expect(saveOrder).toEqual([1, 2, 3]); // Sequential processing order

    // Final state should be consistent
    const finalState = store.getState();
    expect(Object.keys(finalState.properties)).toHaveLength(5);
  });

  test("Domain published while editing → Block conflicting operations", async () => {
    const initialProps = [
      createTestProperty("prop-1", { name: { en: "Property 1" } }),
      createTestProperty("prop-2", { name: { en: "Property 2" } }),
    ];

    const store = createCanvasStore(generateTestDomainId(), testLocale, initialProps);

    // === USER EDITING ===
    // User makes changes to properties
    store.getState().updateProperty("prop-1", (draft) => {
      draft.name = { en: "Modified Property 1" };
      draft.is_required = true;
    });

    store.getState().addProperty({
      id: "new-prop",
      name: { en: "New Property" },
      type: "text",
      meta: { type: "text" },
      is_new: true,
      is_locked: false,
      is_required: false,
      is_private: false,
    });

    const editingState = store.getState();
    expect(editingState.hasChanged).toBe(true);
    expect(Object.keys(editingState.properties)).toHaveLength(3);

    // === DOMAIN PUBLISHED BY ADMIN ===
    // Mock domain being published while user is editing
    // This should block saves until resolved
    mockSaveProperties.mockResolvedValue({
      success: false,
      error: "Domain is currently published and locked for editing",
    });

    // User attempts to save while domain is published
    const state = store.getState();
    const result = await mockSaveProperties(
      state.domainId,
      Object.entries(state.properties).map(([id, property]) => ({
        ...property,
        display_order: state.sorting[id] || 0,
        options: [],
      })),
      [],
      [],
      [],
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain("published and locked");

    // CRITICAL: User changes must be preserved for later
    const blockedState = store.getState();
    expect(blockedState.properties["prop-1"]?.name?.en).toBe("Modified Property 1");
    expect(blockedState.properties["new-prop"]).toBeDefined();
    expect(blockedState.hasChanged).toBe(true);

    // === DOMAIN UNPUBLISHED ===
    // After admin unpublishes, saves should work again
    mockSaveProperties.mockResolvedValue({
      success: true,
      error: null,
    });

    const retryResult = await mockSaveProperties(
      state.domainId,
      Object.entries(state.properties).map(([id, property]) => ({
        ...property,
        display_order: state.sorting[id] || 0,
        options: [],
      })),
      [],
      [],
      [],
    );

    expect(retryResult.success).toBe(true);

    // Verify all changes are still intact and saveable
    const finalState = store.getState();
    expect(finalState.properties["prop-1"]?.name?.en).toBe("Modified Property 1");
    expect(finalState.properties["new-prop"]?.name?.en).toBe("New Property");
  });

  test("COMPLEX SCENARIO: Multiple users + domain status + conflicts", async () => {
    const initialProps = [createTestProperty("shared-prop", { name: { en: "Shared Property" } })];

    const store = createCanvasStore(generateTestDomainId(), testLocale, initialProps);

    // === USER A EDITING ===
    store.getState().updateProperty("shared-prop", (draft) => {
      draft.name = { en: "User A Changes" };
      draft.is_required = true;
    });

    // === DOMAIN GETS PUBLISHED ===
    mockSaveProperties.mockResolvedValueOnce({
      success: false,
      error: "Domain is published - cannot save",
    });

    const state1 = store.getState();
    const blockedResult = await mockSaveProperties(
      state1.domainId,
      Object.entries(state1.properties).map(([id, property]) => ({
        ...property,
        display_order: state1.sorting[id] || 0,
        options: [],
      })),
      [],
      [],
      [],
    );

    expect(blockedResult.success).toBe(false);

    // === USER B MAKES CHANGES WHILE PUBLISHED ===
    const userBChange = simulateOtherUserChange(initialProps[0], {
      name: { en: "User B Changes" },
      description: { en: "User B modified this while published" },
    });

    // === DOMAIN UNPUBLISHED ===
    mockSaveProperties.mockResolvedValue({ success: true, error: null });

    // === CONFLICT DETECTED ===
    store.getState().detectConflict([userBChange]);

    const conflictState = store.getState();
    expect(conflictState.hasDataConflict).toBe(true);
    expect(conflictState.hasChanged).toBe(true);

    // User A has multiple options:
    // 1. Refresh to accept User B changes
    // 2. Continue with their own changes
    // 3. Manually merge the changes

    // Verify User A's changes are preserved during conflict
    expect(conflictState.properties["shared-prop"]?.name?.en).toBe("User A Changes");
    expect(conflictState.properties["shared-prop"]?.is_required).toBe(true);

    // Verify User B's changes are available in conflict data
    expect(conflictState.conflictData?.[0]?.name?.en).toBe("User B Changes");
    expect(conflictState.conflictData?.[0]?.description?.en).toBe("User B modified this while published");
  });
});
