/**
 * @fileoverview Basic NameInput Test - Minimal test to verify current setup
 */
import { screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NameInput } from "@cms/modules/properties/form";
import { renderWithProviders, createMockProperty } from "@cms/modules/shared/form/hooks/__tests__/test-utils";

// Only mock what absolutely needs to be mocked for the test environment
jest.mock("@cms/modules/domain-editor/hooks", () => ({
  useDebugRender: jest.fn(),
}));

describe("NameInput", () => {
  test("edits really edit the property", () => {
    const mockProperty = createMockProperty({ name: { en: "Initial Name" } });
    const { store } = renderWithProviders(<NameInput />, { customProperty: mockProperty });

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Updated Name" } });

    expect(store.getState().properties[mockProperty.id]?.name?.en).toBe("Updated Name");
  });

  test("displayed value reflects changes", () => {
    const mockProperty = createMockProperty({ name: { en: "Test Name" } });
    const { store } = renderWithProviders(<NameInput />, { customProperty: mockProperty });

    // Check initial state: both input and store
    expect(screen.getByDisplayValue("Test Name")).toBeInTheDocument();
    expect(store.getState().properties[mockProperty.id]?.name?.en).toBe("Test Name");

    // Change the value
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "New Name" } });

    // Check changed state: both input and store
    expect(screen.getByDisplayValue("New Name")).toBeInTheDocument();
    expect(store.getState().properties[mockProperty.id]?.name?.en).toBe("New Name");
  });
});
