import { renderHook, act } from "@testing-library/react";
import { useDictionaryTypeDisplay, useDictionaryTypeInput } from "@/entities/dictionaries/hooks/use-dictionary-type";
import { createMockDictionary } from "@/entities/dictionaries/mocks/dictionary-mock-data";
import { createTestDictionaryStore, withDictionaryProvider } from "@/entities/dictionaries/mocks/test-utils";

describe("Dictionary Type Hooks", () => {
  describe("useDictionaryTypeDisplay", () => {
    test("should return the dictionary type", () => {
      // Arrange
      const dictionary = createMockDictionary(1, "test_type", { en: "Test Dictionary" });
      const store = createTestDictionaryStore({ 1: dictionary });

      // Act
      const { result } = renderHook(() => useDictionaryTypeDisplay(1), {
        wrapper: withDictionaryProvider(store),
      });

      // Assert
      expect(result.current).toBe("test_type");
    });

    test("should return undefined for non-existent dictionary", () => {
      // Arrange
      const store = createTestDictionaryStore();

      // Act
      const { result } = renderHook(() => useDictionaryTypeDisplay(999), {
        wrapper: withDictionaryProvider(store),
      });

      // Assert
      expect(result.current).toBeUndefined();
    });
  });

  describe("useDictionaryTypeInput", () => {
    test("should return input props with correct value", () => {
      // Arrange
      const dictionary = createMockDictionary(1, "test_type", { en: "Test Dictionary" });
      const store = createTestDictionaryStore({ 1: dictionary });

      // Act
      const { result } = renderHook(() => useDictionaryTypeInput(1), {
        wrapper: withDictionaryProvider(store),
      });

      // Assert
      expect(result.current.value).toBe("test_type");
      expect(result.current.inputId).toBe("dictionary-type-1");
      expect(typeof result.current.onChange).toBe("function");
    });

    test("should update dictionary type when onChange is called", () => {
      // Arrange
      const dictionary = createMockDictionary(1, "test_type", { en: "Test Dictionary" });
      const store = createTestDictionaryStore({ 1: dictionary });

      // Act
      const { result } = renderHook(() => useDictionaryTypeInput(1), {
        wrapper: withDictionaryProvider(store),
      });

      act(() => {
        result.current.onChange("new_type");
      });

      // Assert
      expect(store.getState().dictionaries[1].type).toBe("new_type");
    });

    test("should show error for empty type", () => {
      // Arrange
      const dictionary = createMockDictionary(1, "", { en: "Test Dictionary" });
      const store = createTestDictionaryStore({ 1: dictionary });

      // Act
      const { result } = renderHook(() => useDictionaryTypeInput(1), {
        wrapper: withDictionaryProvider(store),
      });

      // Assert
      expect(result.current.error).toBeTruthy();
    });
  });
});
