/**
 * @fileoverview Property Name Display Tests - Standardized structure
 */
import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NameDisplay } from "@cms/modules/properties/form";
import { renderWithProviders, createMockProperty } from "@cms/modules/shared/form/hooks/__tests__/test-utils";

// Only mock what absolutely needs to be mocked for the test environment
jest.mock("@cms/modules/domain-editor/hooks", () => ({
  useDebugRender: jest.fn(),
}));

describe("NameDisplay", () => {
  test("displays property name from store", () => {
    const mockProperty = createMockProperty({ name: { en: "Sample Property Name" } });
    renderWithProviders(<NameDisplay />, { customProperty: mockProperty });

    expect(screen.getByText("Sample Property Name")).toBeInTheDocument();
  });

  test("displays fallback when name is empty", () => {
    const mockProperty = createMockProperty({ name: { en: "" } });
    renderWithProviders(<NameDisplay fallback="No name provided" />, { customProperty: mockProperty });

    expect(screen.getByText("No name provided")).toBeInTheDocument();
  });
});
