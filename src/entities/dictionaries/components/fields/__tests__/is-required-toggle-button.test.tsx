import { screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { IsRequiredToggleButton } from "@cms/modules/properties/form/";
import { renderWithProviders, createMockProperty } from "@cms/modules/shared/form/hooks/__tests__/test-utils";

// Only mock what absolutely needs to be mocked for the test environment
jest.mock("@cms/modules/domain-editor/hooks", () => ({
  useDebugRender: jest.fn(),
}));

describe("PropertyRequiredToggleButton", () => {
  test("edits really edit the property", () => {
    const mockProperty = createMockProperty({ is_required: false });
    const { store } = renderWithProviders(<IsRequiredToggleButton />, { customProperty: mockProperty });

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(store.getState().properties[mockProperty.id].is_required).toBe(true);
  });

  test("displayed value reflects changes", () => {
    // Test false state
    const mockProperty = createMockProperty({ is_required: false });
    const { store } = renderWithProviders(<IsRequiredToggleButton />, { customProperty: mockProperty });

    // Check initial state: both button and store
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
    expect(store.getState().properties[mockProperty.id].is_required).toBe(false);

    // Click to change to true state
    const button = screen.getByRole("button");
    fireEvent.click(button);

    // Check changed state: both button and store
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
    expect(store.getState().properties[mockProperty.id].is_required).toBe(true);
  });
});
