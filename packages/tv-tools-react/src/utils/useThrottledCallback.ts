import { useCallback, useRef } from 'react';

/**
 * Throttle the callback not to be called too many times.
 * @param callback - the callback to be throttled
 * @param dependencies - the dependency list for the callback
 * @param configuration - the value that should be returned when
 * the callback is throttled and not called directly
 * @returns function that is a throttled callback
 * @example
 * ```typescript
 * const forward = useThrottledCallback(() => {
 *     const newRenderData = list.moveBy(1);
 *     if (newRenderData !== renderData) {
 *         setRenderData(renderData);
 *         return true;
 *     }
 *     return false;
 * }, [list, renderData], { throttledReturn: true, limitMs: 300 });
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useThrottledCallback<T extends (...args: any) => any>(
	callback: T,
	dependencies: unknown[],
	{
		limitMs = 500,
		throttledReturn,
	}: {
		limitMs?: number;
		throttledReturn: ReturnType<T>;
	},
): T {
	const lastCall = useRef(Number.MIN_SAFE_INTEGER);

	const throttledCallback = useCallback(
		(...args: Parameters<T>): ReturnType<T> => {
			const now = Date.now();
			if (lastCall.current + limitMs > now) {
				return throttledReturn;
			}
			lastCall.current = now;
			return callback(...args);
		},
		dependencies,
	);

	return throttledCallback as T;
}
