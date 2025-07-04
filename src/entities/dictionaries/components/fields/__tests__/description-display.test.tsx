/**
 * @fileoverview Property Description Display Tests - Standardized structure
 */
import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DescriptionDisplay } from "@cms/modules/properties/form/components";
import { renderWithProviders, createMockProperty } from "@cms/modules/shared/form/hooks/__tests__/test-utils";

// Only mock what absolutely needs to be mocked for the test environment
jest.mock("@cms/modules/domain-editor/hooks", () => ({
  useDebugRender: jest.fn(),
}));

describe("PropertyDescriptionDisplay", () => {
  test("displays property description from store", () => {
    const mockProperty = createMockProperty({ description: { en: "Sample Description" } });
    renderWithProviders(<DescriptionDisplay />, { customProperty: mockProperty });

    expect(screen.getByText("Sample Description")).toBeInTheDocument();
  });

  test("displays fallback when description is empty", () => {
    const mockProperty = createMockProperty({ description: { en: "" } });
    renderWithProviders(<DescriptionDisplay fallback="No description provided" />, {
      customProperty: mockProperty,
    });

    expect(screen.getByText("No description provided")).toBeInTheDocument();
  });
});
