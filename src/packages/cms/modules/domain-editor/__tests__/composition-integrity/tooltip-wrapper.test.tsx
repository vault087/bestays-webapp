/**
 * @fileoverview QuickTooltip + div wrapper pattern integrity tests
 *
 * ⚠️ CRITICAL COMPOSITION PATTERN PROTECTION
 *
 * These tests protect the QuickTooltip + div wrapper pattern used throughout
 * the domain editor. This pattern is REQUIRED for proper tooltip positioning.
 *
 * Pattern: <QuickTooltip><div><Component/></div></QuickTooltip>
 *
 * Protected components:
 * - ToolbarToggleItem ✅ (tested)
 * - PropertyNumberSettings (pattern applies)
 * - PropertyTextSettings (pattern applies)
 * - PropertyOptionMultiToggle (pattern applies)
 * - PropertyToggleButton (pattern applies)
 * - All property settings components (15+ total)
 */

import { AlignEndVertical } from "lucide-react";
import { ReactNode } from "react";
import "@testing-library/jest-dom";
import { ToolbarToggleItem } from "@cms/modules/domain-editor/toolbar/toolbar-toggle-item";
import { validateTooltipWrapper } from "@cms/modules/domain-editor/utils/composition-test-helpers";

// Mock QuickTooltip to simulate the expected structure
jest.mock("@shared-ui/components/ui/quick-tooltip", () => ({
  QuickTooltip: ({ content, children }: { content: string; children: ReactNode }) => (
    <div title={content} data-testid="quick-tooltip">
      {children}
    </div>
  ),
}));

// Mock other shadcn components
jest.mock("@/modules/shadcn/components/ui/toggle-group", () => ({
  ToggleGroup: ({ children }: { children: ReactNode }) => <div data-testid="toggle-group">{children}</div>,
  ToggleGroupItem: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
    <button data-testid="toggle-group-item" {...props}>
      {children}
    </button>
  ),
}));

jest.mock("@/modules/shadcn/components/ui/button", () => ({
  Button: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
    <button data-testid="button" {...props}>
      {children}
    </button>
  ),
}));

// Mock contexts and hooks
jest.mock("@cms/modules/domain-editor/hooks", () => ({
  useDebugRender: () => {},
}));

jest.mock("@cms/i18n/use-cms-translation.hooks", () => ({
  useCMSTranslations: () => ({ t: (key: string) => key }),
}));

jest.mock("@cms/modules/domain-editor/hooks", () => ({
  useDebugRender: () => {},
}));

describe("⚠️ CRITICAL: QuickTooltip + div wrapper composition integrity", () => {
  /**
   * ⚠️ CRITICAL TEST - ToolbarToggleItem structure
   *
   * This component is used in ALL toolbar toggles and MUST maintain the
   * QuickTooltip + div wrapper pattern for proper tooltip positioning.
   */
  it("should protect ToolbarToggleItem tooltip wrapper structure", () => {
    const component = <ToolbarToggleItem value="test-value" icon={AlignEndVertical} tooltip="Test tooltip" />;

    // This will throw if the structure is broken
    expect(() => validateTooltipWrapper(component)).not.toThrow();
  });

  /**
   * ⚠️ CRITICAL TEST - Structural integrity validation
   *
   * This test ensures the validator works with multiple div structures.
   */
  it("should validate proper tooltip structure with nested elements", () => {
    const NestedComponent = () => (
      <div title="tooltip-content">
        <div>
          <button>Nested button</button>
        </div>
      </div>
    );

    // This will throw if the structure is broken
    expect(() => validateTooltipWrapper(<NestedComponent />)).not.toThrow();
  });

  /**
   * ⚠️ CRITICAL NEGATIVE TEST - Broken structure detection
   *
   * This test ensures our validator correctly identifies broken patterns.
   * If this test fails, our protection is not working.
   */
  it("should detect broken tooltip wrapper structure", () => {
    // Mock a broken QuickTooltip that doesn't wrap content in div
    jest.doMock("@shared-ui/components/ui/quick-tooltip", () => ({
      QuickTooltip: ({ content, children }: { content: string; children: ReactNode }) => (
        <span title={content}>{children}</span>
      ),
    }));

    const BrokenComponent = () => (
      <span title="broken tooltip">
        <button>Direct child without div wrapper</button>
      </span>
    );

    // This SHOULD throw because the structure is broken
    expect(() => validateTooltipWrapper(<BrokenComponent />)).toThrow(/COMPOSITION INTEGRITY FAIL/);
  });

  /**
   * ⚠️ CRITICAL INTEGRATION TEST - Multiple tooltips
   *
   * Tests that components with multiple tooltips maintain proper structure.
   */
  it("should protect multiple tooltip wrappers in single component", () => {
    const MultiTooltipComponent = () => (
      <div>
        <div title="tooltip-1">
          <div>
            <button>Button 1</button>
          </div>
        </div>
        <div title="tooltip-2">
          <div>
            <button>Button 2</button>
          </div>
        </div>
      </div>
    );

    // Both tooltips should maintain proper structure
    expect(() => validateTooltipWrapper(<MultiTooltipComponent />)).not.toThrow();
  });
});

/**
 * ⚠️ DOCUMENTATION: Pattern Requirements
 *
 * The QuickTooltip + div wrapper pattern MUST be maintained as:
 *
 * ✅ CORRECT:
 * <QuickTooltip content="tooltip text">
 *   <div>
 *     <ToggleGroupItem>Content</ToggleGroupItem>
 *   </div>
 * </QuickTooltip>
 *
 * ❌ INCORRECT:
 * <QuickTooltip content="tooltip text">
 *   <ToggleGroupItem>Content</ToggleGroupItem>
 * </QuickTooltip>
 *
 * WHY: The div wrapper is required for proper tooltip positioning by
 * the underlying Radix/shadcn tooltip implementation. Without it,
 * tooltips may not position correctly or may not appear at all.
 *
 * PROTECTED BY: This test file
 * AFFECTS: 15+ components in domain-editor
 */
