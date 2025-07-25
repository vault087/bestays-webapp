import { render, screen, fireEvent } from "@testing-library/react";
import { Column } from "@tanstack/react-table";
import { BooleanHeaderFilter } from "../header-filters";
import { PropertyRow } from "../types";

// Mock the form dropdown component
jest.mock("@/components/form/inputs/form-dropdown", () => ({
  FormDropDown: ({ selectedOption, options, selectOption }: any) => (
    <select
      data-testid="boolean-filter"
      value={selectedOption.key}
      onChange={(e) => {
        const option = options.find((opt: any) => opt.key === e.target.value);
        selectOption(option);
      }}
    >
      {options.map((option: any) => (
        <option key={option.key} value={option.key}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

describe("BooleanHeaderFilter", () => {
  const mockSetFilterValue = jest.fn();
  const mockColumn = {
    getFilterValue: jest.fn(),
    setFilterValue: mockSetFilterValue,
  } as unknown as Column<PropertyRow, unknown>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render all options correctly", () => {
    mockColumn.getFilterValue = jest.fn().mockReturnValue(undefined);

    render(<BooleanHeaderFilter column={mockColumn} />);

    const select = screen.getByTestId("boolean-filter");
    expect(select).toHaveValue("all");

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent("All");
    expect(options[1]).toHaveTextContent("Yes");
    expect(options[2]).toHaveTextContent("No");
  });

  it("should handle boolean true filter value", () => {
    mockColumn.getFilterValue = jest.fn().mockReturnValue(true);

    render(<BooleanHeaderFilter column={mockColumn} />);

    const select = screen.getByTestId("boolean-filter");
    expect(select).toHaveValue("true");
  });

  it("should handle boolean false filter value", () => {
    mockColumn.getFilterValue = jest.fn().mockReturnValue(false);

    render(<BooleanHeaderFilter column={mockColumn} />);

    const select = screen.getByTestId("boolean-filter");
    expect(select).toHaveValue("false");
  });

  it("should call setFilterValue with undefined when All is selected", () => {
    mockColumn.getFilterValue = jest.fn().mockReturnValue(true);

    render(<BooleanHeaderFilter column={mockColumn} />);

    const select = screen.getByTestId("boolean-filter");
    fireEvent.change(select, { target: { value: "all" } });

    expect(mockSetFilterValue).toHaveBeenCalledWith(undefined);
  });

  it("should call setFilterValue with true when Yes is selected", () => {
    mockColumn.getFilterValue = jest.fn().mockReturnValue(undefined);

    render(<BooleanHeaderFilter column={mockColumn} />);

    const select = screen.getByTestId("boolean-filter");
    fireEvent.change(select, { target: { value: "true" } });

    expect(mockSetFilterValue).toHaveBeenCalledWith(true);
  });

  it("should call setFilterValue with false when No is selected", () => {
    mockColumn.getFilterValue = jest.fn().mockReturnValue(undefined);

    render(<BooleanHeaderFilter column={mockColumn} />);

    const select = screen.getByTestId("boolean-filter");
    fireEvent.change(select, { target: { value: "false" } });

    expect(mockSetFilterValue).toHaveBeenCalledWith(false);
  });
});
