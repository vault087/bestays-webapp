import { screen, fireEvent } from "@testing-library/react";
import { renderWithFieldProviders, createTestProperty } from "@/entities/properties/components/__tests__/test-utils";
import {
  PropertyAreaUncontrolledInput,
  PropertyDivisibleSaleUncontrolledInput,
  PropertyOwnershipTypeUncontrolledInput,
  PropertyPropertyTypeUncontrolledInput,
} from "@/entities/properties/components/ui/single-code-uncontrolled-input";

describe("Single Code Uncontrolled Input Components", () => {
  const locale = "en";
  const mockUpdateProperty = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Component field assignment validation", () => {
    it("PropertyAreaUncontrolledInput should be assigned to area field", () => {
      const property = createTestProperty({ area: "bangkok" });

      renderWithFieldProviders(<PropertyAreaUncontrolledInput locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      expect(screen.getByRole("combobox")).toBeInTheDocument();
      expect(screen.getByText("Bangkok")).toBeInTheDocument();
      expect(screen.getByText("Areas")).toBeInTheDocument();
    });

    it("PropertyPropertyTypeUncontrolledInput should be assigned to property_type field", () => {
      const property = createTestProperty({ property_type: "house" });

      renderWithFieldProviders(<PropertyPropertyTypeUncontrolledInput locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      expect(screen.getByRole("combobox")).toBeInTheDocument();
      expect(screen.getByText("House")).toBeInTheDocument();
      expect(screen.getByText("Property Types")).toBeInTheDocument();
    });

    it("PropertyOwnershipTypeUncontrolledInput should be assigned to ownership_type field", () => {
      const property = createTestProperty({ ownership_type: "freehold" });

      renderWithFieldProviders(<PropertyOwnershipTypeUncontrolledInput locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      expect(screen.getByRole("combobox")).toBeInTheDocument();
      expect(screen.getByText("Freehold")).toBeInTheDocument();
      expect(screen.getByText("Ownership Types")).toBeInTheDocument();
    });

    it("PropertyDivisibleSaleUncontrolledInput should be assigned to divisible_sale field", () => {
      const property = createTestProperty({ divisible_sale: "yes" });

      renderWithFieldProviders(<PropertyDivisibleSaleUncontrolledInput locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      expect(screen.getByRole("combobox")).toBeInTheDocument();
      expect(screen.getByText("Yes")).toBeInTheDocument();
      expect(screen.getByText("Divisible Sale")).toBeInTheDocument();
    });
  });

  describe("Hook integration and basic functionality", () => {
    it("should display current value correctly", () => {
      const property = createTestProperty({ area: "phuket" });

      renderWithFieldProviders(<PropertyAreaUncontrolledInput locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      expect(screen.getByText("Phuket")).toBeInTheDocument();
    });

    it("should display placeholder when no value selected", () => {
      const property = createTestProperty({ area: null });

      renderWithFieldProviders(<PropertyAreaUncontrolledInput locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      expect(screen.getByText("Select option")).toBeInTheDocument();
    });

    it("should have proper field titles and subtitles", () => {
      const property = createTestProperty({
        area: "bangkok",
        property_type: "house",
        ownership_type: "freehold",
        divisible_sale: "yes",
      });

      renderWithFieldProviders(
        <div>
          <PropertyAreaUncontrolledInput locale={locale} />
          <PropertyPropertyTypeUncontrolledInput locale={locale} />
          <PropertyOwnershipTypeUncontrolledInput locale={locale} />
          <PropertyDivisibleSaleUncontrolledInput locale={locale} />
        </div>,
        { property, onPropertyUpdate: mockUpdateProperty },
      );

      // Check titles
      expect(screen.getByText("Areas")).toBeInTheDocument();
      expect(screen.getByText("Property Types")).toBeInTheDocument();
      expect(screen.getByText("Ownership Types")).toBeInTheDocument();
      expect(screen.getByText("Divisible Sale")).toBeInTheDocument();

      // Check subtitles
      expect(screen.getByText("Property areas")).toBeInTheDocument();
      expect(screen.getByText("Types of properties")).toBeInTheDocument();
      expect(screen.getByText("Types of ownership")).toBeInTheDocument();
      expect(screen.getByText("Can property be sold in parts")).toBeInTheDocument();
    });

    it("should open dropdown when clicked", () => {
      const property = createTestProperty({ area: "bangkok" });

      renderWithFieldProviders(<PropertyAreaUncontrolledInput locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      const combobox = screen.getByRole("combobox");
      fireEvent.click(combobox);

      expect(combobox).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("Localization", () => {
    it("should display Thai labels when locale is 'th'", () => {
      const property = createTestProperty({ area: "bangkok" });

      renderWithFieldProviders(<PropertyAreaUncontrolledInput locale="th" />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      expect(screen.getByText("กรุงเทพ")).toBeInTheDocument(); // Bangkok in Thai
      expect(screen.getByText("พื้นที่")).toBeInTheDocument(); // Areas in Thai
    });

    it("should display different field values for different locales", () => {
      const property = createTestProperty({ property_type: "house" });

      const { unmount } = renderWithFieldProviders(<PropertyPropertyTypeUncontrolledInput locale="en" />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      expect(screen.getByText("House")).toBeInTheDocument();
      expect(screen.getByText("Property Types")).toBeInTheDocument();

      unmount();

      renderWithFieldProviders(<PropertyPropertyTypeUncontrolledInput locale="th" />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      expect(screen.getByText("บ้าน")).toBeInTheDocument(); // House in Thai
      expect(screen.getByText("ประเภทอสังหาริมทรัพย์")).toBeInTheDocument(); // Property Types in Thai
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      const property = createTestProperty({ area: "bangkok" });

      renderWithFieldProviders(<PropertyAreaUncontrolledInput locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      const combobox = screen.getByRole("combobox");
      expect(combobox).toHaveAttribute("aria-expanded", "false");
      expect(combobox).toHaveAttribute("role", "combobox");
    });

    it("should have proper label association", () => {
      const property = createTestProperty({ area: "bangkok" });

      renderWithFieldProviders(<PropertyAreaUncontrolledInput locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      const label = screen.getByText("Areas");
      const combobox = screen.getByRole("combobox");

      expect(label).toHaveAttribute("for", combobox.id);
    });

    it("should have live region for subtitle", () => {
      const property = createTestProperty({ area: "bangkok" });

      renderWithFieldProviders(<PropertyAreaUncontrolledInput locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      const subtitle = screen.getByText("Property areas");
      expect(subtitle).toHaveAttribute("role", "region");
      expect(subtitle).toHaveAttribute("aria-live", "polite");
    });
  });

  describe("Multiple field components validation", () => {
    it("should handle multiple components on the same page without conflicts", () => {
      const property = createTestProperty({
        area: "bangkok",
        property_type: "house",
        ownership_type: "freehold",
        divisible_sale: "yes",
      });

      renderWithFieldProviders(
        <div>
          <PropertyAreaUncontrolledInput locale={locale} />
          <PropertyPropertyTypeUncontrolledInput locale={locale} />
          <PropertyOwnershipTypeUncontrolledInput locale={locale} />
          <PropertyDivisibleSaleUncontrolledInput locale={locale} />
        </div>,
        { property, onPropertyUpdate: mockUpdateProperty },
      );

      // All values should be displayed correctly
      expect(screen.getByText("Bangkok")).toBeInTheDocument();
      expect(screen.getByText("House")).toBeInTheDocument();
      expect(screen.getByText("Freehold")).toBeInTheDocument();
      expect(screen.getByText("Yes")).toBeInTheDocument();

      // All field labels should be present
      expect(screen.getByText("Areas")).toBeInTheDocument();
      expect(screen.getByText("Property Types")).toBeInTheDocument();
      expect(screen.getByText("Ownership Types")).toBeInTheDocument();
      expect(screen.getByText("Divisible Sale")).toBeInTheDocument();
    });

    it("should have unique input IDs for different fields", () => {
      const property = createTestProperty({
        area: "bangkok",
        property_type: "house",
      });

      renderWithFieldProviders(
        <div>
          <PropertyAreaUncontrolledInput locale={locale} />
          <PropertyPropertyTypeUncontrolledInput locale={locale} />
        </div>,
        { property, onPropertyUpdate: mockUpdateProperty },
      );

      const comboboxes = screen.getAllByRole("combobox");
      expect(comboboxes[0].id).not.toBe(comboboxes[1].id);
      expect(comboboxes[0].id).toContain("area");
      expect(comboboxes[1].id).toContain("property_type");
    });
  });

  describe("Edge cases and error handling", () => {
    it("should handle missing or invalid initial value gracefully", () => {
      const property = createTestProperty({ area: "invalid_code" });

      renderWithFieldProviders(<PropertyAreaUncontrolledInput locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      // Should not crash and should render component
      expect(screen.getByRole("combobox")).toBeInTheDocument();
      expect(screen.getByText("Areas")).toBeInTheDocument();
    });

    it("should handle keyboard interactions", () => {
      const property = createTestProperty({ area: "bangkok" });

      renderWithFieldProviders(<PropertyAreaUncontrolledInput locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      const combobox = screen.getByRole("combobox");

      // Focus the combobox
      combobox.focus();
      expect(combobox).toHaveFocus();

      // Press Enter to open
      fireEvent.keyDown(combobox, { key: "Enter" });
      expect(combobox).toHaveAttribute("aria-expanded", "true");
    });

    it("should handle focus and blur events", () => {
      const property = createTestProperty({ area: "bangkok" });

      renderWithFieldProviders(<PropertyAreaUncontrolledInput locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      const combobox = screen.getByRole("combobox");

      fireEvent.focus(combobox);
      expect(combobox).toHaveFocus();

      fireEvent.blur(combobox);
      expect(combobox).not.toHaveFocus();
    });
  });
});
