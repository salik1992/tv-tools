/**
 * Run a function asynchronously.
 * This is useful for deferring execution until the current call stack is cleared.
 */
export const runAsync = (fn: () => unknown) => setTimeout(fn, 0);
