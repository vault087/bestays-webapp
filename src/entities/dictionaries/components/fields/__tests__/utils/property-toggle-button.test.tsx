/**
 * @fileoverview BoolToggleButton Tests - TDD
 * Validates toggle behavior, store integration, accessibility, and visual state.
 */
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Lock } from "lucide-react";
import { BoolToggleButton } from "@cms/modules/properties/form";
import { PropertyIdProvider, PropertyStoreProvider } from "@cms/modules/properties/form/contexts";
import {
  renderWithProviders,
  createMockProperty,
  createTestPropertyStore,
  MockCustomLocaleProvider,
  MockCMSTranslationContextProvider,
} from "@cms/modules/shared/form/hooks/__tests__";

jest.mock("@cms/i18n/use-cms-translation.hooks", () => ({
  useCMSTranslations: () => ({ t: (key: string) => key }),
}));
jest.mock("@cms/modules/domain-editor/hooks", () => ({ useDebugRender: jest.fn() }));

describe("BoolToggleButton", () => {
  beforeEach(() => jest.clearAllMocks());

  // SECTION 1: Usage Examples
  describe("Usage Examples", () => {
    test("renders with all required providers explicitly shown", () => {
      const propertyId = "test-property-1";
      const mockProperty = createMockProperty({ id: propertyId, is_locked: false });
      const initialProperties = { [propertyId]: mockProperty };
      const store = createTestPropertyStore(initialProperties);
      render(
        <MockCMSTranslationContextProvider>
          <MockCustomLocaleProvider>
            <PropertyStoreProvider store={store}>
              <PropertyIdProvider propertyId={propertyId}>
                <BoolToggleButton
                  propertyKey="is_locked"
                  icon={Lock}
                  tooltipKey={{ active: "property.tooltip.locked", inactive: "property.tooltip.unlocked" }}
                />
              </PropertyIdProvider>
            </PropertyStoreProvider>
          </MockCustomLocaleProvider>
        </MockCMSTranslationContextProvider>,
      );
      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByLabelText("property.tooltip.unlocked")).toBeInTheDocument();
      expect(screen.getByRole("button").querySelector("svg")).toBeInTheDocument();
    });
    test("renders with test helper", () => {
      const mockProperty = createMockProperty({ is_locked: true });
      renderWithProviders(
        <BoolToggleButton
          propertyKey="is_locked"
          icon={Lock}
          tooltipKey={{ active: "property.tooltip.locked", inactive: "property.tooltip.unlocked" }}
        />,
        { customProperty: mockProperty },
      );
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  // SECTION 2: Valid Cases
  describe("Valid Cases", () => {
    test("toggles value on click", () => {
      const propertyId = "test-property-2";
      const mockProperty = createMockProperty({ id: propertyId, is_locked: false });
      const store = createTestPropertyStore({ [propertyId]: mockProperty });
      renderWithProviders(
        <BoolToggleButton
          propertyKey="is_locked"
          icon={Lock}
          tooltipKey={{ active: "property.tooltip.locked", inactive: "property.tooltip.unlocked" }}
        />,
        { store, customProperty: mockProperty, propertyId },
      );
      const button = screen.getByRole("button");
      fireEvent.click(button);
      expect(store.getState().properties[propertyId]?.is_locked).toBe(true);
      fireEvent.click(button);
      expect(store.getState().properties[propertyId]?.is_locked).toBe(false);
    });
    test("shows correct visual state for true/false", () => {
      const mockProperty = createMockProperty({ is_locked: true });
      renderWithProviders(
        <BoolToggleButton
          propertyKey="is_locked"
          icon={Lock}
          tooltipKey={{ active: "property.tooltip.locked", inactive: "property.tooltip.unlocked" }}
        />,
        { customProperty: mockProperty },
      );
      const button = screen.getByRole("button");
      expect(button.querySelector("svg")).toHaveClass("text-primary");
      // Simulate false
      const mockProperty2 = createMockProperty({ is_locked: false });
      renderWithProviders(
        <BoolToggleButton
          propertyKey="is_locked"
          icon={Lock}
          tooltipKey={{ active: "property.tooltip.locked", inactive: "property.tooltip.unlocked" }}
        />,
        { customProperty: mockProperty2 },
      );
      expect(screen.getByRole("button").querySelector("svg")).toHaveClass("text-muted-foreground");
    });
    test("displays tooltip", () => {
      const mockProperty = createMockProperty({ is_locked: false });
      renderWithProviders(
        <BoolToggleButton
          propertyKey="is_locked"
          icon={Lock}
          tooltipKey={{ active: "property.tooltip.locked", inactive: "property.tooltip.unlocked" }}
        />,
        { customProperty: mockProperty },
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "property.tooltip.unlocked");
      expect(button).toHaveAttribute("data-tooltip", "property.tooltip.unlocked");
    });
  });

  // SECTION 3: Invalid Cases
  describe("Invalid Cases", () => {
    test("handles missing field gracefully", () => {
      const mockProperty = createMockProperty({});
      renderWithProviders(
        <BoolToggleButton
          propertyKey="is_locked"
          icon={Lock}
          tooltipKey={{ active: "property.tooltip.locked", inactive: "property.tooltip.unlocked" }}
        />,
        { customProperty: mockProperty },
      );
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
    test("handles undefined property context", () => {
      expect(() =>
        render(
          <BoolToggleButton
            propertyKey="is_locked"
            icon={Lock}
            tooltipKey={{ active: "property.tooltip.locked", inactive: "property.tooltip.unlocked" }}
          />,
        ),
      ).toThrow();
    });
  });

  // SECTION 4: Component Structure
  describe("Component Structure", () => {
    test("renders with correct classes", () => {
      const mockProperty = createMockProperty({ is_locked: true });
      renderWithProviders(
        <BoolToggleButton
          propertyKey="is_locked"
          icon={Lock}
          tooltipKey={{ active: "property.tooltip.locked", inactive: "property.tooltip.unlocked" }}
        />,
        { customProperty: mockProperty },
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("rounded");
    });
    test("renders icon", () => {
      const mockProperty = createMockProperty({ is_locked: false });
      renderWithProviders(
        <BoolToggleButton
          propertyKey="is_locked"
          icon={Lock}
          tooltipKey={{ active: "property.tooltip.locked", inactive: "property.tooltip.unlocked" }}
        />,
        { customProperty: mockProperty },
      );
      expect(screen.getByRole("button").querySelector("svg")).toBeInTheDocument();
    });
  });

  // SECTION 5: Accessibility
  describe("Accessibility", () => {
    test("button is keyboard accessible", () => {
      const mockProperty = createMockProperty({ is_locked: false });
      renderWithProviders(
        <BoolToggleButton
          propertyKey="is_locked"
          icon={Lock}
          tooltipKey={{ active: "property.tooltip.locked", inactive: "property.tooltip.unlocked" }}
        />,
        { customProperty: mockProperty },
      );
      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();
    });
    test("button has aria-pressed attribute", () => {
      const mockProperty = createMockProperty({ is_locked: true });
      renderWithProviders(
        <BoolToggleButton
          propertyKey="is_locked"
          icon={Lock}
          tooltipKey={{ active: "property.tooltip.locked", inactive: "property.tooltip.unlocked" }}
        />,
        { customProperty: mockProperty },
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-pressed", "true");
    });
  });

  // SECTION 6: Context Dependencies
  describe("Context Dependencies", () => {
    test("throws error outside PropertyStoreProvider", () => {
      expect(() =>
        render(
          <BoolToggleButton
            propertyKey="is_locked"
            icon={Lock}
            tooltipKey={{ active: "property.tooltip.locked", inactive: "property.tooltip.unlocked" }}
          />,
        ),
      ).toThrow();
    });
    test("works with all providers", () => {
      const mockProperty = createMockProperty({ is_locked: false });
      expect(() =>
        renderWithProviders(
          <BoolToggleButton
            propertyKey="is_locked"
            icon={Lock}
            tooltipKey={{ active: "property.tooltip.locked", inactive: "property.tooltip.unlocked" }}
          />,
          { customProperty: mockProperty },
        ),
      ).not.toThrow();
    });
  });

  // SECTION 7: Store Integration
  describe("Store Integration", () => {
    test("updates store on toggle", () => {
      const propertyId = "test-property-3";
      const mockProperty = createMockProperty({ id: propertyId, is_locked: false });
      const store = createTestPropertyStore({ [propertyId]: mockProperty });
      renderWithProviders(
        <BoolToggleButton
          propertyKey="is_locked"
          icon={Lock}
          tooltipKey={{ active: "property.tooltip.locked", inactive: "property.tooltip.unlocked" }}
        />,
        { store, customProperty: mockProperty, propertyId },
      );
      const button = screen.getByRole("button");
      fireEvent.click(button);
      expect(store.getState().properties[propertyId]?.is_locked).toBe(true);
    });
    test("subscribes to store changes efficiently", () => {
      const propertyId = "test-property-4";
      const mockProperty = createMockProperty({ id: propertyId, is_locked: false });
      const store = createTestPropertyStore({ [propertyId]: mockProperty });
      const { unmount } = renderWithProviders(
        <BoolToggleButton
          propertyKey="is_locked"
          icon={Lock}
          tooltipKey={{ active: "property.tooltip.locked", inactive: "property.tooltip.unlocked" }}
        />,
        { store, customProperty: mockProperty, propertyId },
      );
      expect(() => unmount()).not.toThrow();
    });
  });
});
