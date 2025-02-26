import { useCallback, useRef } from 'react';

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

	return throttledCallback as unknown as T;
}
