/**
 * @fileoverview Conflict Detection Tests
 *
 * Tests the conflict detection logic requirements:
 * 1. Initialize store with db data
 * 2. If new db ≠ stored db AND hasChanged=true → show dialog
 * 3. If new db ≠ stored db AND hasChanged=false → auto reset
 * 4. If new db = stored db → just update reference
 */

import { createCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store";
import { Property } from "@cms/modules/properties/property.types";

describe("Conflict Detection", () => {
  // Generate unique domain ID for each test to prevent state pollution
  let testCounter = 0;
  const generateTestDomainId = (): string => `test-domain-${++testCounter}-${Date.now()}`;

  const mockProperty1: Property = {
    id: "prop-1",
    group_id: null,
    name: { en: "Property 1" },
    description: { en: "Description 1" },
    code: null,
    is_locked: false,
    type: "text",
    meta: { type: "text" },
    is_required: false,
    is_private: false,
    is_new: false,
    display_order: 0,
    options: [],
  };

  const mockModifiedProperty1: Property = {
    ...mockProperty1,
    name: { en: "Modified Property 1" },
  };

  it("should initialize store with db data normally", () => {
    const store = createCanvasStore(generateTestDomainId(), "en", [mockProperty1]);
    const state = store.getState();

    expect(state.dbProperties).toHaveLength(1);
    expect(state.dbProperties[0]?.id).toBe("prop-1");
    expect(state.hasDataConflict).toBe(false);
  });

  it("should show conflict dialog when db changed AND user has unsaved changes", () => {
    const store = createCanvasStore(generateTestDomainId(), "en", [mockProperty1]);

    // Simulate user making changes
    store.getState().updateProperty("prop-1", (draft) => {
      draft.name = { en: "User Edit" };
    });

    expect(store.getState().hasChanged).toBe(true);

    // Simulate new db data (someone else changed it)
    store.getState().detectConflict([mockModifiedProperty1]);

    const state = store.getState();
    expect(state.hasDataConflict).toBe(true);
    expect(state.conflictData).toEqual([mockModifiedProperty1]);
  });

  it("should auto-reset when db changed AND user has NO unsaved changes", () => {
    const store = createCanvasStore(generateTestDomainId(), "en", [mockProperty1]);

    // User has no changes
    expect(store.getState().hasChanged).toBe(false);

    // Simulate new db data
    store.getState().detectConflict([mockModifiedProperty1]);

    const state = store.getState();
    expect(state.hasDataConflict).toBe(false);
    expect(state.dbProperties[0]?.name?.en).toBe("Modified Property 1");
  });

  it("should just update reference when db data is the same", () => {
    const store = createCanvasStore(generateTestDomainId(), "en", [mockProperty1]);
    const initialState = store.getState();

    // Same data
    store.getState().detectConflict([mockProperty1]);

    const state = store.getState();
    expect(state.hasDataConflict).toBe(false);
    expect(state.dbProperties).toEqual([mockProperty1]);
    expect(state.properties).toEqual(initialState.properties); // Form state unchanged
  });

  it("should resolve conflict with refresh (same as reset)", () => {
    const store = createCanvasStore(generateTestDomainId(), "en", [mockProperty1]);

    // Simulate conflict state by calling detectConflict with different data
    // This sets up the conflict properly instead of using setState directly
    const conflictData = [mockModifiedProperty1];

    // First create a change to trigger conflict
    store.getState().updateProperty("prop-1", (draft) => {
      draft.name = { en: "User Edit" };
    });

    // Then detect conflict with new data
    store.getState().detectConflict(conflictData);

    // Verify conflict is detected
    expect(store.getState().hasDataConflict).toBe(true);

    // User clicks refresh
    store.getState().resolveConflict("refresh");

    const state = store.getState();
    expect(state.hasDataConflict).toBe(false);
    expect(state.conflictData).toBe(null);
    expect(state.dbProperties[0]?.name?.en).toBe("Modified Property 1");
  });
});
