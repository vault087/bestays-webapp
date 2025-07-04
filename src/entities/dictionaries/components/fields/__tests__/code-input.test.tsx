import { screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CodeInput } from "@cms/modules/properties/form/components";
import { renderWithProviders, createMockProperty } from "@cms/modules/shared/form/hooks/__tests__/test-utils";

// Only mock what absolutely needs to be mocked for the test environment
jest.mock("@cms/modules/domain-editor/hooks", () => ({
  useDebugRender: jest.fn(),
}));

describe("PropertyCodeInput", () => {
  test("edits really edit the property", () => {
    const mockProperty = createMockProperty({ code: "INITIAL_CODE" });
    const { store } = renderWithProviders(<CodeInput />, { customProperty: mockProperty });

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "UPDATED_CODE" } });

    expect(store.getState().properties[mockProperty.id]?.code).toBe("UPDATED_CODE");
  });

  test("displayed value reflects changes", () => {
    const mockProperty = createMockProperty({ code: "TEST_CODE" });
    const { store } = renderWithProviders(<CodeInput />, { customProperty: mockProperty });

    // Check initial state: both input and store
    expect(screen.getByDisplayValue("TEST_CODE")).toBeInTheDocument();
    expect(store.getState().properties[mockProperty.id]?.code).toBe("TEST_CODE");

    // Change the value
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "NEW_CODE" } });

    // Check changed state: both input and store
    expect(screen.getByDisplayValue("NEW_CODE")).toBeInTheDocument();
    expect(store.getState().properties[mockProperty.id]?.code).toBe("NEW_CODE");
  });
});
