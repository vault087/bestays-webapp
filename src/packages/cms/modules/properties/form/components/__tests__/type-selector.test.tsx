import { screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TypeSelector } from "@cms/modules/properties/form";
import { renderWithProviders, createMockProperty } from "@cms/modules/shared/form/hooks/__tests__/test-utils";

// Only mock what absolutely needs to be mocked for the test environment
jest.mock("@cms/modules/domain-editor/hooks", () => ({
  useDebugRender: jest.fn(),
}));

describe("TypeSelector", () => {
  test("displayed value and property in a store reflect selector changes", () => {
    const mockProperty = createMockProperty({ type: "text" });
    const { store } = renderWithProviders(<TypeSelector />, { customProperty: mockProperty });

    // Check initial state: both button and store
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(store.getState().properties[mockProperty.id]?.type).toBe("text");

    // Click to open dropdown and select size
    // fireEvent.click(screen.getByRole("button"));

    const types = ["text", "number", "option", "size"];
    const metaType = (type: string): string | undefined => {
      switch (type) {
        case "text":
        case "number":
        case "option":
          return type;
        default:
          return undefined;
      }
    };

    types.forEach((type) => {
      fireEvent.click(screen.getByRole("button"));
      act(() => fireEvent.click(screen.getByText(`property.property_type.${type}`)));
      const property = store.getState().properties[mockProperty.id];
      expect(property?.type).toBe(type);

      expect(property?.meta?.type).toBe(metaType(type));
    });
  });
});
