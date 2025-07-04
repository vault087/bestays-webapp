/**
 * @fileoverview Property Description Floating Input Tests - Standardized structure
 */
import { screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DescriptionFloatingInput } from "@cms/modules/properties/form/components";
import { renderWithProviders, createMockProperty } from "@cms/modules/shared/form/hooks/__tests__/test-utils";

// Only mock what absolutely needs to be mocked for the test environment
jest.mock("@cms/modules/domain-editor/hooks", () => ({
  useDebugRender: jest.fn(),
}));

describe("PropertyDescriptionFloatingInput", () => {
  test("edits really edit the property", () => {
    const mockProperty = createMockProperty({ description: { en: "Initial Description" } });
    const { store } = renderWithProviders(<DescriptionFloatingInput />, { customProperty: mockProperty });

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Updated Description" } });

    expect(store.getState().properties[mockProperty.id]?.description?.en).toBe("Updated Description");
  });

  test("displayed value reflects changes", () => {
    const mockProperty = createMockProperty({ description: { en: "Test Description" } });
    const { store } = renderWithProviders(<DescriptionFloatingInput />, { customProperty: mockProperty });

    // Check initial state: both input and store
    expect(screen.getByDisplayValue("Test Description")).toBeInTheDocument();
    expect(store.getState().properties[mockProperty.id]?.description?.en).toBe("Test Description");

    // Change the value
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "New Description" } });

    // Check changed state: both input and store
    expect(screen.getByDisplayValue("New Description")).toBeInTheDocument();
    expect(store.getState().properties[mockProperty.id]?.description?.en).toBe("New Description");
  });
});
