/**
 * @fileoverview General test utility functions
 */

/**
 * Type for validity test pairs [value, isValid]
 */
export type ValidityPair<T> = [T, boolean];

/**
 * Waits for the next tick (useful for async operations in tests)
 */
export function nextTick(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Creates a promise that resolves after a given time
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Suppresses console errors during test execution
 */
export function suppressConsoleError(fn: () => void): void {
  const spy = jest.spyOn(console, "error").mockImplementation(() => {});
  try {
    fn();
  } finally {
    spy.mockRestore();
  }
}
