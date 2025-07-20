import { renderHook, act } from "@testing-library/react";
import React from "react";
import { DictionaryStoreTestProvider } from "@/entities/dictionaries/features/edit/mocks/test-utils";
import {
  useDictionaryCodeDisplay,
  useDictionaryCodeInput,
} from "@/entities/dictionaries/features/form/hooks/use-dictionary-code";

describe("useDictionaryCodeDisplay", () => {
  it("should return dictionary code for existing dictionary", () => {
    const TestComponent = ({ children }: { children: React.ReactNode }) => (
      <DictionaryStoreTestProvider>{children}</DictionaryStoreTestProvider>
    );

    const { result } = renderHook(() => useDictionaryCodeDisplay(1), {
      wrapper: TestComponent,
    });

    expect(result.current).toBe("PROPERTY_TYPES");
  });

  it("should return undefined for non-existing dictionary", () => {
    const TestComponent = ({ children }: { children: React.ReactNode }) => (
      <DictionaryStoreTestProvider>{children}</DictionaryStoreTestProvider>
    );

    const { result } = renderHook(() => useDictionaryCodeDisplay(999), {
      wrapper: TestComponent,
    });

    expect(result.current).toBeUndefined();
  });
});

describe("useDictionaryCodeInput", () => {
  it("should return correct input props for existing dictionary", () => {
    const TestComponent = ({ children }: { children: React.ReactNode }) => (
      <DictionaryStoreTestProvider>{children}</DictionaryStoreTestProvider>
    );

    const { result } = renderHook(() => useDictionaryCodeInput(1), {
      wrapper: TestComponent,
    });

    expect(result.current).toEqual({
      inputId: "dictionary-code-input-1",
      value: "PROPERTY_TYPES",
      onChange: expect.any(Function),
      placeholder: "Enter dictionary code",
      error: undefined,
    });
  });

  it("should handle onChange correctly", () => {
    const TestComponent = ({ children }: { children: React.ReactNode }) => (
      <DictionaryStoreTestProvider>{children}</DictionaryStoreTestProvider>
    );

    const { result } = renderHook(() => useDictionaryCodeInput(1), {
      wrapper: TestComponent,
    });

    // Test onChange function wrapped in act
    expect(() => {
      act(() => {
        result.current.onChange("NEW_CODE");
      });
    }).not.toThrow();
  });
});
