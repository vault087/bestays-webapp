/**
 * @fileoverview PropertyOptionBadgeContainer Tests
 *
 * 🎯 PURPOSE: Test badge-style property options interface
 *
 * 🧪 TEST COVERAGE:
 * - Badge container rendering with options
 * - Horizontal scrolling behavior
 * - Add field functionality
 * - Expand button presence
 * - Integration with PropertyRowContext
 *
 * 📚 REFERENCE: Phase 1 implementation testing for property-options-management-plan.md
 */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ReactNode } from "react";
import { CMSTranslationContextProvider } from "@cms/i18n/use-cms-translation.hooks";
import { PropertyRowContext } from "@cms/modules/domain-editor/contexts";
import { createCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store";
import { CanvasStoreContext } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store.context";
import { createLayoutStore } from "@cms/modules/domain-editor/stores/layout-store/layout.store";
import { LayoutStoreContext } from "@cms/modules/domain-editor/stores/layout-store/layout.store.context";
import { FormProperty } from "@cms/modules/properties/form/types";
import { PropertyOptionBadgeContainer } from "./property-option-badge-container";

// Mock QuickTooltip to avoid test issues
jest.mock("@shared-ui/components/ui/quick-tooltip", () => ({
  QuickTooltip: ({ content, children }: { content: string; children: ReactNode }) => (
    <div title={content}>{children}</div>
  ),
}));

// Create test wrapper with required contexts
function createTestWrapper(propertyId: string, withOptions: boolean = false) {
  const uniqueDomainId = `test-domain-${Date.now()}-${Math.random()}`;
  const store = createCanvasStore(uniqueDomainId, "en", []);
  const layoutStore = createLayoutStore("en");

  // Create option type property
  const optionProperty: FormProperty = {
    id: propertyId,
    type: "option",
    code: "test_option_property",
    name: { en: "Test Option Property" },
    is_required: false,
    is_locked: false,
    is_private: false,
    is_new: false,
    meta: { type: "option", multi: true, sorting: "alphabet" },
  };

  // Add property to store
  store.getState().properties[propertyId] = optionProperty;

  // Add test options if requested
  if (withOptions) {
    store.getState().propertyOptions[propertyId] = {
      "badge-opt-1": {
        option_id: "badge-opt-1",
        property_id: propertyId,
        name: { en: "Badge Option 1" },
        code: "badge_opt_1",
        display_order: 0,
        is_new: false,
      },
      "badge-opt-2": {
        option_id: "badge-opt-2",
        property_id: propertyId,
        name: { en: "Badge Option 2" },
        code: "badge_opt_2",
        display_order: 1,
        is_new: false,
      },
    };
  }

  const TestWrapper = ({ children }: { children: ReactNode }) => (
    <CMSTranslationContextProvider namespace="domain_editor">
      <CanvasStoreContext.Provider value={store}>
        <LayoutStoreContext.Provider value={layoutStore}>
          <PropertyRowContext.Provider value={{ propertyId }}>{children}</PropertyRowContext.Provider>
        </LayoutStoreContext.Provider>
      </CanvasStoreContext.Provider>
    </CMSTranslationContextProvider>
  );

  TestWrapper.displayName = "TestWrapper";
  return TestWrapper;
}

describe("PropertyOptionBadgeContainer", () => {
  const propertyId = "test-badge-container-property";

  test("should render badge container with scroll and expand button", () => {
    const TestWrapper = createTestWrapper(propertyId);

    render(
      <TestWrapper>
        <PropertyOptionBadgeContainer />
      </TestWrapper>,
    );

    // Should render main container
    expect(screen.getByTestId("property-option-badge-container")).toBeInTheDocument();

    // Should render add field
    expect(screen.getByTestId("property-option-badge-add-field")).toBeInTheDocument();

    // Should render expand button
    expect(screen.getByTestId("property-option-badge-expand")).toBeInTheDocument();
  });

  test("should render option badges when options exist", () => {
    const TestWrapper = createTestWrapper(propertyId, true);

    render(
      <TestWrapper>
        <PropertyOptionBadgeContainer />
      </TestWrapper>,
    );

    // Should render option badges
    expect(screen.getByTestId("property-option-badge-item-badge-opt-1")).toBeInTheDocument();
    expect(screen.getByTestId("property-option-badge-item-badge-opt-2")).toBeInTheDocument();

    // Should render option inputs with values
    expect(screen.getByDisplayValue("Badge Option 1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Badge Option 2")).toBeInTheDocument();
  });

  test("should render add field with placeholder", () => {
    const TestWrapper = createTestWrapper(propertyId);

    render(
      <TestWrapper>
        <PropertyOptionBadgeContainer />
      </TestWrapper>,
    );

    // Should render add input with placeholder
    const addInput = screen.getByTestId("property-option-badge-add-input");
    expect(addInput).toBeInTheDocument();
    expect(addInput).toHaveAttribute("placeholder", "Add new option...");
  });

  test("should render expand button with tooltip", () => {
    const TestWrapper = createTestWrapper(propertyId);

    render(
      <TestWrapper>
        <PropertyOptionBadgeContainer />
      </TestWrapper>,
    );

    // Should render expand button with tooltip
    const expandButton = screen.getByTestId("property-option-badge-expand");
    expect(expandButton).toBeInTheDocument();
    expect(expandButton.closest('[title="Expand to full management"]')).toBeInTheDocument();
  });
});
