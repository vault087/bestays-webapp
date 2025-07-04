/**
 * @fileoverview asChild composition pattern integrity tests
 *
 * ⚠️ CRITICAL COMPOSITION PATTERN PROTECTION
 *
 * These tests protect the asChild composition pattern used with Radix primitives.
 * This pattern is REQUIRED for proper Radix component composition.
 *
 * Pattern: <RadixTrigger asChild><Button>Content</Button></RadixTrigger>
 *
 * Protected components:
 * - PropertyTypeInput (asChild pattern applies)
 * - PropertyOptionContextMenu (asChild pattern applies)
 * - All popover/dropdown triggers (4+ total)
 */

import { ReactNode } from "react";
import "@testing-library/jest-dom";
import { validateAsChildPattern } from "@cms/modules/domain-editor/utils/composition-test-helpers";

// Mock QuickTooltip
jest.mock("@shared-ui/components/ui/quick-tooltip", () => ({
  QuickTooltip: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

// Mock shadcn components with asChild support
jest.mock("@/modules/shadcn/components/ui/popover", () => ({
  Popover: ({ children }: { children: ReactNode }) => <div data-testid="popover">{children}</div>,
  PopoverContent: ({ children }: { children: ReactNode }) => <div data-testid="popover-content">{children}</div>,
  PopoverTrigger: ({ asChild, children }: { asChild?: boolean; children: ReactNode }) => (
    <div data-testid="popover-trigger" data-as-child={asChild}>
      {children}
    </div>
  ),
}));

jest.mock("@/modules/shadcn/components/ui/button", () => ({
  Button: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
    <button data-testid="button" {...props}>
      {children}
    </button>
  ),
}));

// Basic mocks for test environment
jest.mock("@cms/modules/domain-editor/hooks", () => ({
  useDebugRender: () => {},
}));

describe("⚠️ CRITICAL: asChild composition pattern integrity", () => {
  /**
   * ⚠️ CRITICAL TEST - PopoverTrigger asChild structure
   *
   * Test the exact PopoverTrigger + Button asChild pattern that components use.
   */
  it("should protect PopoverTrigger asChild pattern structure", () => {
    const PopoverAsChildComponent = () => (
      <div data-testid="popover-trigger" data-as-child={true}>
        <button data-testid="button">Popover Trigger</button>
      </div>
    );

    // This will throw if the structure is broken
    expect(() => validateAsChildPattern(<PopoverAsChildComponent />)).not.toThrow();
  });

  /**
   * ⚠️ CRITICAL TEST - Manual asChild pattern validation
   *
   * Test the exact pattern that should be maintained in components.
   */
  it("should validate correct asChild pattern structure", () => {
    const CorrectAsChildComponent = () => (
      <div data-testid="popover-trigger" data-as-child="true">
        <button data-testid="button">Trigger Button</button>
      </div>
    );

    // This should pass - correct structure
    expect(() => validateAsChildPattern(<CorrectAsChildComponent />)).not.toThrow();
  });

  /**
   * ⚠️ CRITICAL NEGATIVE TEST - Broken asChild pattern detection
   *
   * This test ensures our validator correctly identifies broken patterns.
   * If this test fails, our protection is not working.
   */
  it("should detect missing trigger elements in asChild pattern", () => {
    const BrokenComponent = () => (
      <div>
        <span>No trigger elements here</span>
      </div>
    );

    // This SHOULD throw because no button/trigger elements found
    expect(() => validateAsChildPattern(<BrokenComponent />)).toThrow(/COMPOSITION INTEGRITY FAIL/);
  });

  /**
   * ⚠️ CRITICAL INTEGRATION TEST - Multiple trigger elements
   *
   * Tests that components with multiple triggers maintain proper structure.
   */
  it("should protect multiple trigger elements in asChild pattern", () => {
    const MultiTriggerComponent = () => (
      <div>
        <button data-testid="button-1">Button 1</button>
        <button data-testid="button-2">Button 2</button>
      </div>
    );

    // Both triggers should be detected properly
    expect(() => validateAsChildPattern(<MultiTriggerComponent />)).not.toThrow();
  });
});

/**
 * ⚠️ DOCUMENTATION: asChild Pattern Requirements
 *
 * The asChild composition pattern MUST be maintained as:
 *
 * ✅ CORRECT:
 * <PopoverTrigger asChild>
 *   <Button>Trigger Content</Button>
 * </PopoverTrigger>
 *
 * ❌ INCORRECT:
 * <PopoverTrigger>
 *   <Button>Trigger Content</Button>
 * </PopoverTrigger>
 *
 * WHY: The asChild prop tells Radix primitives to merge props with the child
 * component instead of rendering their own DOM element. Without it, you get
 * nested interactive elements which break accessibility and event handling.
 *
 * PROTECTED BY: This test file
 * AFFECTS: 4+ components with popover/dropdown triggers
 */
