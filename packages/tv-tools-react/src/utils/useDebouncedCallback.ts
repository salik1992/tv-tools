import { useCallback, useRef } from 'react';

/**
 * Debounce the callback not to be called too many times.
 * @param callback - the callback to be throttled
 * @param dependencies - the dependency list for the callback
 * @param configuration - the value that should be returned when
 * the callback is debounced and not called directly
 * @returns function that is a debounced callback
 * @example
 * ```typescript
 * const debouncedSetSearchQuery = useDebouncedCallback((query: string) => {
 *  	setSearchQuery(query);
 * }, [setSearchQuery], { limitMs: 2000 });
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebouncedCallback<T extends (...args: any) => any>(
	callback: T,
	dependencies: unknown[],
	{ limitMs = 500 }: { limitMs?: number },
): T {
	const callTimeout = useRef(Number.MIN_SAFE_INTEGER);

	const debouncedCallback = useCallback((...args: Parameters<T>): void => {
		window.clearTimeout(callTimeout.current);
		callTimeout.current = window.setTimeout(() => {
			callback(...args);
		}, limitMs);
	}, dependencies);

	return debouncedCallback as T;
}
