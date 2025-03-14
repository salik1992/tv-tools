import { renderHook } from '@testing-library/react';
import { useThrottledCallback } from './useThrottledCallback';

jest.useFakeTimers();

describe('useThrottledCallback', () => {
	it('should return a throttled callback', () => {
		const throttledReturn = Symbol('throttledReturn');
		const normalReturn = Symbol('normalReturn');
		const callback = jest.fn().mockReturnValue(normalReturn);
		const { result } = renderHook(() =>
			useThrottledCallback(callback, [], {
				throttledReturn,
				limitMs: 300,
			}),
		);

		const throttledCallback = result.current;
		expect(callback).not.toHaveBeenCalled();

		expect(throttledCallback()).toBe(normalReturn);
		expect(callback).toHaveBeenCalledTimes(1);

		expect(throttledCallback()).toBe(throttledReturn);
		expect(callback).toHaveBeenCalledTimes(1);

		jest.advanceTimersByTime(300);

		expect(throttledCallback()).toBe(normalReturn);
		expect(callback).toHaveBeenCalledTimes(2);
	});
});
