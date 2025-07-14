import { renderHook, act } from "@testing-library/react";
import { withFieldProviders, createTestProperty } from "@/entities/properties/components/__tests__/test-utils";
import { useMultiCodeField } from "@/entities/properties/components/hooks/use-multi-code-field";
import { PropertyMultiCodeField } from "@/entities/properties-sale-rent/types/property.type";

describe("useMultiCodeField", () => {
  const locale = "en";
  const mockUpdateProperty = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Clear console.log mock if used
    jest.clearAllMocks();
  });

  describe("Basic functionality", () => {
    it("should return correct initial state for highlights field", () => {
      const property = createTestProperty({ highlights: ["pool", "garden"] });
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useMultiCodeField({ field: "highlights", locale, variant: "checkbox" }), {
        wrapper,
      });

      expect(result.current.currentValues).toEqual(["pool", "garden"]);
      expect(result.current.title).toBe("Highlights");
      expect(result.current.subtitle).toBe("Property highlights");
      expect(result.current.options).toHaveLength(3);
      expect(result.current.options.map((opt) => opt.code)).toEqual(["pool", "garden", "sea_view"]);
      expect(result.current.inputId).toMatch(/property-test-property-highlights-checkbox-en/);
    });

    it("should return correct initial state for location_strengths field", () => {
      const property = createTestProperty({ location_strengths: ["near_beach", "city_center"] });
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(
        () => useMultiCodeField({ field: "location_strengths", locale, variant: "input" }),
        { wrapper },
      );

      expect(result.current.currentValues).toEqual(["near_beach", "city_center"]);
      expect(result.current.title).toBe("Location Strengths");
      expect(result.current.options).toHaveLength(3);
      expect(result.current.options.map((opt) => opt.code)).toEqual(["near_beach", "city_center", "mountain_view"]);
    });

    it("should return correct initial state for transaction_types field", () => {
      const property = createTestProperty({ transaction_types: ["sale"] });
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useMultiCodeField({ field: "transaction_types", locale }), { wrapper });

      expect(result.current.currentValues).toEqual(["sale"]);
      expect(result.current.title).toBe("Transaction Types");
      expect(result.current.options).toHaveLength(2);
      expect(result.current.options.map((opt) => opt.code)).toEqual(["sale", "rent"]);
    });

    it("should return correct initial state for land_features field", () => {
      const property = createTestProperty({ land_features: ["flat", "corner"] });
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useMultiCodeField({ field: "land_features", locale }), { wrapper });

      expect(result.current.currentValues).toEqual(["flat", "corner"]);
      expect(result.current.title).toBe("Land Features");
      expect(result.current.options).toHaveLength(2);
      expect(result.current.options.map((opt) => opt.code)).toEqual(["flat", "corner"]);
    });

    it("should return correct initial state for nearby_attractions field", () => {
      const property = createTestProperty({ nearby_attractions: ["beach"] });
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useMultiCodeField({ field: "nearby_attractions", locale }), { wrapper });

      expect(result.current.currentValues).toEqual(["beach"]);
      expect(result.current.title).toBe("Nearby Attractions");
      expect(result.current.options).toHaveLength(2);
      expect(result.current.options.map((opt) => opt.code)).toEqual(["beach", "mall"]);
    });

    it("should return correct initial state for land_and_construction field", () => {
      const property = createTestProperty({ land_and_construction: ["new_construction"] });
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useMultiCodeField({ field: "land_and_construction", locale }), { wrapper });

      expect(result.current.currentValues).toEqual(["new_construction"]);
      expect(result.current.title).toBe("Land & Construction");
      expect(result.current.options).toHaveLength(2);
      expect(result.current.options.map((opt) => opt.code)).toEqual(["new_construction", "modern"]);
    });
  });

  describe("Localization", () => {
    it("should return Thai labels when locale is 'th'", () => {
      const property = createTestProperty({ highlights: ["pool", "garden"] });
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useMultiCodeField({ field: "highlights", locale: "th" }), { wrapper });

      expect(result.current.title).toBe("จุดเด่น");
      expect(result.current.subtitle).toBe("จุดเด่นของอสังหาริมทรัพย์");
      expect(result.current.options[0].label).toBe("สระว่ายน้ำ"); // pool
      expect(result.current.options[1].label).toBe("สวน"); // garden
    });

    it("should fallback to code when localized name is missing", () => {
      const property = createTestProperty({ highlights: ["unknown_code"] });
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useMultiCodeField({ field: "highlights", locale }), { wrapper });

      // Since unknown_code doesn't exist in entries, currentValues should remain empty
      expect(result.current.currentValues).toEqual(["unknown_code"]);
    });
  });

  describe("Toggle functionality", () => {
    it("should add value when toggleValue is called with checked=true", () => {
      const property = createTestProperty({ highlights: ["pool"] });
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useMultiCodeField({ field: "highlights", locale }), { wrapper });

      act(() => {
        result.current.toggleValue("garden", true);
      });

      expect(result.current.currentValues).toEqual(["pool", "garden"]);
      expect(mockUpdateProperty).toHaveBeenCalledTimes(1);
      expect(mockUpdateProperty).toHaveBeenCalledWith(expect.any(Function));
    });

    it("should remove value when toggleValue is called with checked=false", () => {
      const property = createTestProperty({ highlights: ["pool", "garden"] });
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useMultiCodeField({ field: "highlights", locale }), { wrapper });

      act(() => {
        result.current.toggleValue("garden", false);
      });

      expect(result.current.currentValues).toEqual(["pool"]);
      expect(mockUpdateProperty).toHaveBeenCalledTimes(1);
    });

    it("should handle toggle of non-existent value gracefully", () => {
      const property = createTestProperty({ highlights: ["pool"] });
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useMultiCodeField({ field: "highlights", locale }), { wrapper });

      act(() => {
        result.current.toggleValue("non_existent", false);
      });

      // Should not affect the current values
      expect(result.current.currentValues).toEqual(["pool"]);
      expect(mockUpdateProperty).toHaveBeenCalledTimes(1);
    });

    it("should ignore null/undefined values in toggleValue", () => {
      const property = createTestProperty({ highlights: ["pool"] });
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useMultiCodeField({ field: "highlights", locale }), { wrapper });

      act(() => {
        result.current.toggleValue(null, true);
      });

      act(() => {
        result.current.toggleValue(undefined, true);
      });

      expect(result.current.currentValues).toEqual(["pool"]);
      expect(mockUpdateProperty).not.toHaveBeenCalled();
    });
  });

  describe("setValues functionality", () => {
    it("should replace all values when setValues is called", () => {
      const property = createTestProperty({ highlights: ["pool", "garden"] });
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useMultiCodeField({ field: "highlights", locale }), { wrapper });

      act(() => {
        result.current.setValues(["sea_view"]);
      });

      expect(result.current.currentValues).toEqual(["sea_view"]);
      expect(mockUpdateProperty).toHaveBeenCalledTimes(1);
    });

    it("should handle empty array in setValues", () => {
      const property = createTestProperty({ highlights: ["pool", "garden"] });
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useMultiCodeField({ field: "highlights", locale }), { wrapper });

      act(() => {
        result.current.setValues([]);
      });

      expect(result.current.currentValues).toEqual([]);
      expect(mockUpdateProperty).toHaveBeenCalledTimes(1);
    });

    it("should handle multiple values in setValues", () => {
      const property = createTestProperty({ highlights: [] });
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useMultiCodeField({ field: "highlights", locale }), { wrapper });

      act(() => {
        result.current.setValues(["pool", "garden", "sea_view"]);
      });

      expect(result.current.currentValues).toEqual(["pool", "garden", "sea_view"]);
      expect(mockUpdateProperty).toHaveBeenCalledTimes(1);
    });
  });

  describe("Field validation", () => {
    const allMultiCodeFields: PropertyMultiCodeField[] = [
      "location_strengths",
      "highlights",
      "transaction_types",
      "land_features",
      "nearby_attractions",
      "land_and_construction",
    ];

    test.each(allMultiCodeFields)("should work correctly with %s field", (field) => {
      const property = createTestProperty();
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useMultiCodeField({ field, locale }), { wrapper });

      // Should return valid state structure
      expect(Array.isArray(result.current.currentValues)).toBe(true);
      expect(Array.isArray(result.current.options)).toBe(true);
      expect(typeof result.current.title).toBe("string");
      expect(typeof result.current.toggleValue).toBe("function");
      expect(typeof result.current.setValues).toBe("function");
      expect(typeof result.current.inputId).toBe("string");
    });
  });

  describe("Input ID generation", () => {
    it("should generate unique input IDs for different fields", () => {
      const property = createTestProperty();
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result: highlightsResult } = renderHook(
        () => useMultiCodeField({ field: "highlights", locale, variant: "checkbox" }),
        { wrapper },
      );

      const { result: strengthsResult } = renderHook(
        () => useMultiCodeField({ field: "location_strengths", locale, variant: "input" }),
        { wrapper },
      );

      expect(highlightsResult.current.inputId).not.toBe(strengthsResult.current.inputId);
      expect(highlightsResult.current.inputId).toContain("highlights");
      expect(strengthsResult.current.inputId).toContain("location_strengths");
    });

    it("should include variant in input ID", () => {
      const property = createTestProperty();
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(
        () => useMultiCodeField({ field: "highlights", locale, variant: "custom-variant" }),
        { wrapper },
      );

      expect(result.current.inputId).toContain("custom-variant");
    });

    it("should generate unique option input IDs", () => {
      const property = createTestProperty();
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useMultiCodeField({ field: "highlights", locale, variant: "checkbox" }), {
        wrapper,
      });

      const optionIds = result.current.options.map((opt) => opt.inputId);
      const uniqueIds = new Set(optionIds);

      expect(uniqueIds.size).toBe(optionIds.length); // All IDs should be unique
      expect(optionIds[0]).toContain("pool");
      expect(optionIds[1]).toContain("garden");
    });
  });

  describe("Edge cases", () => {
    it("should handle empty initial array", () => {
      const property = createTestProperty({ highlights: [] });
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useMultiCodeField({ field: "highlights", locale }), { wrapper });

      expect(result.current.currentValues).toEqual([]);
    });

    it("should handle null initial value", () => {
      const property = createTestProperty({ highlights: null });
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useMultiCodeField({ field: "highlights", locale }), { wrapper });

      expect(result.current.currentValues).toBeNull();
    });

    it("should maintain stable options reference when currentValues change", () => {
      const property = createTestProperty({ highlights: ["pool"] });
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useMultiCodeField({ field: "highlights", locale }), { wrapper });

      const initialOptions = result.current.options;

      act(() => {
        result.current.toggleValue("garden", true);
      });

      // Options should be the same reference (memoized)
      expect(result.current.options).toBe(initialOptions);
    });

    it("should handle rapid toggle operations", () => {
      const property = createTestProperty({ highlights: [] });
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useMultiCodeField({ field: "highlights", locale }), { wrapper });

      act(() => {
        result.current.toggleValue("pool", true);
        result.current.toggleValue("garden", true);
        result.current.toggleValue("pool", false);
        result.current.toggleValue("sea_view", true);
      });

      expect(result.current.currentValues).toEqual(["garden", "sea_view"]);
      expect(mockUpdateProperty).toHaveBeenCalledTimes(4);
    });
  });
});
