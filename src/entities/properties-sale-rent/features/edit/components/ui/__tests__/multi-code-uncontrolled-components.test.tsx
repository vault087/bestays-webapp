import { screen, fireEvent } from "@testing-library/react";
import {
  renderWithFieldProviders,
  createTestProperty,
} from "@/entities/properties-sale-rent/features/edit/components/__tests__/test-utils";
import {
  PropertyHighlightsUncontrolledCheckbox,
  PropertyLocationStrengthsUncontrolledCheckbox,
  PropertyTransactionTypesUncontrolledCheckbox,
  PropertyLandFeaturesUncontrolledCheckbox,
  PropertyNearbyAttractionsUncontrolledCheckbox,
  PropertyLandAndConstructionUncontrolledCheckbox,
} from "@/entities/properties-sale-rent/features/edit/components/ui";
import {
  PropertyHighlightsUncontrolledInput,
  PropertyLocationStrengthsUncontrolledInput,
  PropertyTransactionTypesUncontrolledInput,
  PropertyLandFeaturesUncontrolledInput,
  PropertyNearbyAttractionsUncontrolledInput,
  PropertyLandAndConstructionUncontrolledInput,
} from "@/entities/properties-sale-rent/features/edit/components/ui/multi-code-uncontrolled-input";

describe("Multi Code Uncontrolled Components", () => {
  const locale = "en";
  const mockUpdateProperty = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Checkbox Component field assignment validation", () => {
    it("PropertyHighlightsUncontrolledCheckbox should be assigned to highlights field", () => {
      const property = createTestProperty({ highlights: ["pool", "garden"] });

      renderWithFieldProviders(<PropertyHighlightsUncontrolledCheckbox locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      expect(screen.getByText("Highlights")).toBeDefined();
      expect(screen.getByText("Swimming Pool")).toBeDefined();
      expect(screen.getByText("Garden")).toBeDefined();
      expect(screen.getAllByRole("checkbox")).toHaveLength(3); // 3 highlight options
    });

    it("PropertyLocationStrengthsUncontrolledCheckbox should be assigned to location_strengths field", () => {
      const property = createTestProperty({ location_strengths: ["near_beach"] });

      renderWithFieldProviders(<PropertyLocationStrengthsUncontrolledCheckbox locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      expect(screen.getByText("Location Strengths")).toBeDefined();
      expect(screen.getByText("Near Beach")).toBeDefined();
      expect(screen.getAllByRole("checkbox")).toHaveLength(3); // 3 location strength options
    });

    it("PropertyTransactionTypesUncontrolledCheckbox should be assigned to transaction_types field", () => {
      const property = createTestProperty({ transaction_types: ["sale"] });

      renderWithFieldProviders(<PropertyTransactionTypesUncontrolledCheckbox locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      expect(screen.getByText("Transaction Types")).toBeDefined();
      expect(screen.getByText("Sale")).toBeDefined();
      expect(screen.getAllByRole("checkbox")).toHaveLength(2); // 2 transaction type options
    });

    it("PropertyLandFeaturesUncontrolledCheckbox should be assigned to land_features field", () => {
      const property = createTestProperty({ land_features: ["flat"] });

      renderWithFieldProviders(<PropertyLandFeaturesUncontrolledCheckbox locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      expect(screen.getByText("Land Features")).toBeDefined();
      expect(screen.getByText("Flat Land")).toBeDefined();
      expect(screen.getAllByRole("checkbox")).toHaveLength(2); // 2 land feature options
    });

    it("PropertyNearbyAttractionsUncontrolledCheckbox should be assigned to nearby_attractions field", () => {
      const property = createTestProperty({ nearby_attractions: ["beach"] });

      renderWithFieldProviders(<PropertyNearbyAttractionsUncontrolledCheckbox locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      expect(screen.getByText("Nearby Attractions")).toBeDefined();
      expect(screen.getByText("Beach")).toBeDefined();
      expect(screen.getAllByRole("checkbox")).toHaveLength(2); // 2 nearby attraction options
    });

    it("PropertyLandAndConstructionUncontrolledCheckbox should be assigned to land_and_construction field", () => {
      const property = createTestProperty({ land_and_construction: ["new_construction"] });

      renderWithFieldProviders(<PropertyLandAndConstructionUncontrolledCheckbox locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      expect(screen.getByText("Land & Construction")).toBeDefined();
      expect(screen.getByText("New Construction")).toBeDefined();
      expect(screen.getAllByRole("checkbox")).toHaveLength(2); // 2 land and construction options
    });
  });

  describe("Input Component field assignment validation", () => {
    it("PropertyHighlightsUncontrolledInput should be assigned to highlights field", () => {
      const property = createTestProperty({ highlights: ["pool", "garden"] });

      renderWithFieldProviders(<PropertyHighlightsUncontrolledInput locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      expect(screen.getByText("Highlights")).toBeDefined();
      expect(screen.getByDisplayValue("Swimming Pool, Garden")).toBeDefined();
    });

    it("PropertyLocationStrengthsUncontrolledInput should be assigned to location_strengths field", () => {
      const property = createTestProperty({ location_strengths: ["near_beach", "city_center"] });

      renderWithFieldProviders(<PropertyLocationStrengthsUncontrolledInput locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      expect(screen.getByText("Location Strengths")).toBeDefined();
      expect(screen.getByDisplayValue("Near Beach, City Center")).toBeDefined();
    });

    it("PropertyTransactionTypesUncontrolledInput should be assigned to transaction_types field", () => {
      const property = createTestProperty({ transaction_types: ["sale", "rent"] });

      renderWithFieldProviders(<PropertyTransactionTypesUncontrolledInput locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      expect(screen.getByText("Transaction Types")).toBeDefined();
      expect(screen.getByDisplayValue("Sale, Rent")).toBeDefined();
    });

    it("PropertyLandFeaturesUncontrolledInput should be assigned to land_features field", () => {
      const property = createTestProperty({ land_features: ["flat", "corner"] });

      renderWithFieldProviders(<PropertyLandFeaturesUncontrolledInput locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      expect(screen.getByText("Land Features")).toBeDefined();
      expect(screen.getByDisplayValue("Flat Land, Corner Plot")).toBeDefined();
    });

    it("PropertyNearbyAttractionsUncontrolledInput should be assigned to nearby_attractions field", () => {
      const property = createTestProperty({ nearby_attractions: ["beach", "mall"] });

      renderWithFieldProviders(<PropertyNearbyAttractionsUncontrolledInput locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      expect(screen.getByText("Nearby Attractions")).toBeDefined();
      expect(screen.getByDisplayValue("Beach, Shopping Mall")).toBeDefined();
    });

    it("PropertyLandAndConstructionUncontrolledInput should be assigned to land_and_construction field", () => {
      const property = createTestProperty({ land_and_construction: ["new_construction", "modern"] });

      renderWithFieldProviders(<PropertyLandAndConstructionUncontrolledInput locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      expect(screen.getByText("Land & Construction")).toBeDefined();
      expect(screen.getByDisplayValue("New Construction, Modern Style")).toBeDefined();
    });
  });

  describe("Checkbox hook integration and functionality", () => {
    it("should display checked state correctly for selected values", () => {
      const property = createTestProperty({ highlights: ["pool", "garden"] });

      renderWithFieldProviders(<PropertyHighlightsUncontrolledCheckbox locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      const checkboxes = screen.getAllByRole("checkbox");

      // First checkbox (pool) should be checked
      expect(checkboxes[0]).toBeChecked();
      // Second checkbox (garden) should be checked
      expect(checkboxes[1]).toBeChecked();
      // Third checkbox (sea_view) should not be checked
      expect(checkboxes[2]).not.toBeChecked();
    });

    it("should handle checkbox toggle correctly", () => {
      const property = createTestProperty({ highlights: ["pool"] });

      renderWithFieldProviders(<PropertyHighlightsUncontrolledCheckbox locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      const checkboxes = screen.getAllByRole("checkbox");

      // Toggle garden checkbox (should add to selection)
      fireEvent.click(checkboxes[1]);

      expect(mockUpdateProperty).toHaveBeenCalledTimes(1);
      expect(mockUpdateProperty).toHaveBeenCalledWith(expect.any(Function));
    });

    it("should display empty state correctly", () => {
      const property = createTestProperty({ highlights: [] });

      renderWithFieldProviders(<PropertyHighlightsUncontrolledCheckbox locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      const checkboxes = screen.getAllByRole("checkbox");

      // All checkboxes should be unchecked
      checkboxes.forEach((checkbox) => {
        expect(checkbox).not.toBeChecked();
      });
    });
  });

  describe("Input hook integration and functionality", () => {
    it("should display selected values correctly", () => {
      const property = createTestProperty({ highlights: ["pool", "sea_view"] });

      renderWithFieldProviders(<PropertyHighlightsUncontrolledInput locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      // Check that both selected values are displayed
      expect(screen.getByDisplayValue("Swimming Pool, Sea View")).toBeDefined();
    });

    it("should display empty state correctly", () => {
      const property = createTestProperty({ highlights: [] });

      renderWithFieldProviders(<PropertyHighlightsUncontrolledInput locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      const input = screen.getByRole("combobox");
      expect(input).toHaveAttribute("placeholder", "Highlights");
    });

    it("should handle null values gracefully", () => {
      const property = createTestProperty({ highlights: null });

      renderWithFieldProviders(<PropertyHighlightsUncontrolledInput locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      // Should not crash and should render input
      expect(screen.getByRole("combobox")).toBeDefined();
    });
  });

  describe("Localization support", () => {
    it("should display Thai labels for checkbox components", () => {
      const property = createTestProperty({ highlights: ["pool", "garden"] });

      renderWithFieldProviders(<PropertyHighlightsUncontrolledCheckbox locale="th" />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      expect(screen.getByText("จุดเด่น")).toBeDefined(); // Highlights in Thai
      expect(screen.getByText("สระว่ายน้ำ")).toBeDefined(); // Swimming Pool in Thai
      expect(screen.getByText("สวน")).toBeDefined(); // Garden in Thai
    });

    it("should display Thai labels for input components", () => {
      const property = createTestProperty({ highlights: ["pool"] });

      renderWithFieldProviders(<PropertyHighlightsUncontrolledInput locale="th" />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      expect(screen.getByText("จุดเด่น")).toBeDefined(); // Highlights in Thai
      expect(screen.getByDisplayValue("สระว่ายน้ำ")).toBeDefined(); // Swimming Pool in Thai
    });
  });

  describe("Multiple components interaction", () => {
    it("should handle multiple checkbox components without conflicts", () => {
      const property = createTestProperty({
        highlights: ["pool"],
        location_strengths: ["near_beach"],
        transaction_types: ["sale"],
      });

      renderWithFieldProviders(
        <div>
          <PropertyHighlightsUncontrolledCheckbox locale={locale} />
          <PropertyLocationStrengthsUncontrolledCheckbox locale={locale} />
          <PropertyTransactionTypesUncontrolledCheckbox locale={locale} />
        </div>,
        { property, onPropertyUpdate: mockUpdateProperty },
      );

      expect(screen.getByText("Highlights")).toBeDefined();
      expect(screen.getByText("Location Strengths")).toBeDefined();
      expect(screen.getByText("Transaction Types")).toBeDefined();

      expect(screen.getByText("Swimming Pool")).toBeDefined();
      expect(screen.getByText("Near Beach")).toBeDefined();
      expect(screen.getByText("Sale")).toBeDefined();
    });

    it("should handle multiple input components without conflicts", () => {
      const property = createTestProperty({
        highlights: ["pool", "garden"],
        location_strengths: ["city_center"],
        transaction_types: ["rent"],
      });

      renderWithFieldProviders(
        <div>
          <PropertyHighlightsUncontrolledInput locale={locale} />
          <PropertyLocationStrengthsUncontrolledInput locale={locale} />
          <PropertyTransactionTypesUncontrolledInput locale={locale} />
        </div>,
        { property, onPropertyUpdate: mockUpdateProperty },
      );

      expect(screen.getByDisplayValue("Swimming Pool, Garden")).toBeDefined();
      expect(screen.getByDisplayValue("City Center")).toBeDefined();
      expect(screen.getByDisplayValue("Rent")).toBeDefined();
    });

    it("should have unique IDs for different field components", () => {
      const property = createTestProperty({
        highlights: ["pool"],
        location_strengths: ["near_beach"],
      });

      renderWithFieldProviders(
        <div>
          <PropertyHighlightsUncontrolledInput locale={locale} />
          <PropertyLocationStrengthsUncontrolledInput locale={locale} />
        </div>,
        { property, onPropertyUpdate: mockUpdateProperty },
      );

      const inputs = screen.getAllByRole("combobox");
      expect(inputs[0].id).not.toBe(inputs[1].id);
      expect(inputs[0].id).toContain("highlights");
      expect(inputs[1].id).toContain("location_strengths");
    });
  });

  describe("Edge cases and error handling", () => {
    it("should handle components with missing field data gracefully", () => {
      const property = createTestProperty({ highlights: undefined });

      renderWithFieldProviders(<PropertyHighlightsUncontrolledCheckbox locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      // Should not crash and should render checkboxes
      expect(screen.getAllByRole("checkbox")).toHaveLength(3);
    });

    it("should handle invalid field values gracefully", () => {
      const property = createTestProperty({ highlights: ["invalid_code"] });

      renderWithFieldProviders(<PropertyHighlightsUncontrolledCheckbox locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      // Should render without crashing
      expect(screen.getByText("Highlights")).toBeDefined();
    });

    it("should maintain component isolation", () => {
      const property = createTestProperty({
        highlights: ["pool"],
        location_strengths: ["near_beach"],
      });

      renderWithFieldProviders(
        <div>
          <PropertyHighlightsUncontrolledCheckbox locale={locale} />
          <PropertyLocationStrengthsUncontrolledCheckbox locale={locale} />
        </div>,
        { property, onPropertyUpdate: mockUpdateProperty },
      );

      const allCheckboxes = screen.getAllByRole("checkbox");

      // First three checkboxes should be for highlights
      // Fourth through sixth should be for location_strengths
      expect(allCheckboxes).toHaveLength(6); // 3 + 3 checkboxes total

      // Clicking a highlight checkbox should not affect location strength checkboxes
      fireEvent.click(allCheckboxes[1]); // Click garden checkbox

      expect(mockUpdateProperty).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility and ARIA support", () => {
    it("should have proper labels for checkbox components", () => {
      const property = createTestProperty({ highlights: ["pool"] });

      renderWithFieldProviders(<PropertyHighlightsUncontrolledCheckbox locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      const checkboxes = screen.getAllByRole("checkbox");

      checkboxes.forEach((checkbox) => {
        expect(checkbox).toHaveAttribute("id");
        // Each checkbox should have a corresponding label
        const label = document.querySelector(`label[for="${checkbox.id}"]`);
        expect(label).toBeTruthy();
      });
    });

    it("should have live regions for subtitles", () => {
      const property = createTestProperty({ highlights: ["pool"] });

      renderWithFieldProviders(<PropertyHighlightsUncontrolledCheckbox locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      const subtitle = screen.getByText("Property highlights");
      expect(subtitle).toHaveAttribute("role", "region");
      expect(subtitle).toHaveAttribute("aria-live", "polite");
    });

    it("should have proper combobox accessibility for input components", () => {
      const property = createTestProperty({ highlights: ["pool"] });

      renderWithFieldProviders(<PropertyHighlightsUncontrolledInput locale={locale} />, {
        property,
        onPropertyUpdate: mockUpdateProperty,
      });

      const combobox = screen.getByRole("combobox");
      expect(combobox).toHaveAttribute("id");
      expect(combobox).toHaveAttribute("aria-expanded");
    });
  });
});
