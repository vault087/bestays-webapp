import { renderHook, act } from "@testing-library/react";
import { withFieldProviders, createTestProperty } from "@/entities/properties/components/__tests__/test-utils";
import { useCodeField } from "@/entities/properties/components/hooks/use-code-field";
import { PropertyCodeField } from "@/entities/properties-sale-rent/types/property.type";

describe("useCodeField", () => {
  const locale = "en";
  const mockUpdateProperty = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic functionality", () => {
    it("should return correct initial state for area field", () => {
      const property = createTestProperty({ area: "bangkok" });
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useCodeField({ field: "area", locale, variant: "input" }), { wrapper });

      expect(result.current.currentValue.code).toBe("bangkok");
      expect(result.current.currentValue.label).toBe("Bangkok");
      expect(result.current.title).toBe("Areas");
      expect(result.current.subtitle).toBe("Property areas");
      expect(result.current.options).toHaveLength(3);
      expect(result.current.options.map((opt) => opt.code)).toEqual(["bangkok", "phuket", "chiang_mai"]);
      expect(result.current.inputId).toMatch(/property-code-test-property-area-input-en/);
    });

    it("should return correct initial state for property_type field", () => {
      const property = createTestProperty({ property_type: "house" });
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useCodeField({ field: "property_type", locale, variant: "select" }), {
        wrapper,
      });

      expect(result.current.currentValue.code).toBe("house");
      expect(result.current.currentValue.label).toBe("House");
      expect(result.current.title).toBe("Property Types");
      expect(result.current.options).toHaveLength(3);
      expect(result.current.options.map((opt) => opt.code)).toEqual(["house", "condo", "villa"]);
    });

    it("should return correct initial state for ownership_type field", () => {
      const property = createTestProperty({ ownership_type: "freehold" });
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useCodeField({ field: "ownership_type", locale }), { wrapper });

      expect(result.current.currentValue.code).toBe("freehold");
      expect(result.current.currentValue.label).toBe("Freehold");
      expect(result.current.title).toBe("Ownership Types");
      expect(result.current.options).toHaveLength(2);
      expect(result.current.options.map((opt) => opt.code)).toEqual(["freehold", "leasehold"]);
    });

    it("should return correct initial state for divisible_sale field", () => {
      const property = createTestProperty({ divisible_sale: "yes" });
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useCodeField({ field: "divisible_sale", locale }), { wrapper });

      expect(result.current.currentValue.code).toBe("yes");
      expect(result.current.currentValue.label).toBe("Yes");
      expect(result.current.title).toBe("Divisible Sale");
      expect(result.current.options).toHaveLength(2);
      expect(result.current.options.map((opt) => opt.code)).toEqual(["yes", "no"]);
    });
  });

  describe("Localization", () => {
    it("should return Thai labels when locale is 'th'", () => {
      const property = createTestProperty({ area: "bangkok" });
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useCodeField({ field: "area", locale: "th" }), { wrapper });

      expect(result.current.currentValue.label).toBe("กรุงเทพ");
      expect(result.current.title).toBe("พื้นที่");
      expect(result.current.options[0].label).toBe("กรุงเทพ");
      expect(result.current.options[1].label).toBe("ภูเก็ต");
    });

    it("should fallback to code when localized name is missing", () => {
      const property = createTestProperty({ area: "unknown_code" });
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useCodeField({ field: "area", locale }), { wrapper });

      expect(result.current.currentValue.label).toBe("unknown_code");
    });
  });

  describe("State updates", () => {
    it("should update local state and call updateProperty when setValue is called", () => {
      const property = createTestProperty({ area: "bangkok" });
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useCodeField({ field: "area", locale }), { wrapper });

      act(() => {
        result.current.setValue("phuket");
      });

      // Check that local state updated immediately
      expect(result.current.currentValue.code).toBe("phuket");
      expect(result.current.currentValue.label).toBe("Phuket");

      // Check that updateProperty was called
      expect(mockUpdateProperty).toHaveBeenCalledTimes(1);
      expect(mockUpdateProperty).toHaveBeenCalledWith(expect.any(Function));
    });

    it("should handle multiple setValue calls correctly", () => {
      const property = createTestProperty({ property_type: "house" });
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useCodeField({ field: "property_type", locale }), { wrapper });

      act(() => {
        result.current.setValue("condo");
      });

      expect(result.current.currentValue.code).toBe("condo");
      expect(mockUpdateProperty).toHaveBeenCalledTimes(1);

      act(() => {
        result.current.setValue("villa");
      });

      expect(result.current.currentValue.code).toBe("villa");
      expect(mockUpdateProperty).toHaveBeenCalledTimes(2);
    });
  });

  describe("Field validation", () => {
    const allCodeFields: PropertyCodeField[] = ["area", "ownership_type", "property_type", "divisible_sale"];

    test.each(allCodeFields)("should work correctly with %s field", (field) => {
      const property = createTestProperty();
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useCodeField({ field, locale }), { wrapper });

      // Should return valid state structure
      expect(result.current.currentValue).toHaveProperty("code");
      expect(result.current.currentValue).toHaveProperty("label");
      expect(typeof result.current.title).toBe("string");
      expect(Array.isArray(result.current.options)).toBe(true);
      expect(typeof result.current.setValue).toBe("function");
      expect(typeof result.current.inputId).toBe("string");
    });
  });

  describe("Input ID generation", () => {
    it("should generate unique input IDs for different fields", () => {
      const property = createTestProperty();
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result: areaResult } = renderHook(() => useCodeField({ field: "area", locale, variant: "input" }), {
        wrapper,
      });

      const { result: typeResult } = renderHook(
        () => useCodeField({ field: "property_type", locale, variant: "select" }),
        { wrapper },
      );

      expect(areaResult.current.inputId).not.toBe(typeResult.current.inputId);
      expect(areaResult.current.inputId).toContain("area");
      expect(typeResult.current.inputId).toContain("property_type");
    });

    it("should include variant in input ID", () => {
      const property = createTestProperty();
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useCodeField({ field: "area", locale, variant: "custom-variant" }), {
        wrapper,
      });

      expect(result.current.inputId).toContain("custom-variant");
    });
  });

  describe("Edge cases", () => {
    it("should handle empty initial value", () => {
      const property = createTestProperty({ area: null });
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useCodeField({ field: "area", locale }), { wrapper });

      expect(result.current.currentValue.code).toBeNull();
      expect(result.current.currentValue.label).toBeNull();
    });

    it("should maintain stable options reference when currentValue changes", () => {
      const property = createTestProperty({ area: "bangkok" });
      const { wrapper } = withFieldProviders({ property, onPropertyUpdate: mockUpdateProperty });

      const { result } = renderHook(() => useCodeField({ field: "area", locale }), { wrapper });

      const initialOptions = result.current.options;

      act(() => {
        result.current.setValue("phuket");
      });

      // Options should be the same reference (memoized)
      expect(result.current.options).toBe(initialOptions);
    });
  });
});
