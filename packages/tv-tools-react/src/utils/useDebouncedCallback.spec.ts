import { renderHook } from '@testing-library/react';
import { useDebouncedCallback } from './useDebouncedCallback';

jest.useFakeTimers();

describe('useDebouncedCallback', () => {
	it('should return a debounced callback', () => {
		const callback = jest.fn();
		const { result } = renderHook(() =>
			useDebouncedCallback(callback, [], {
				limitMs: 300,
			}),
		);

		const debouncedCallback = result.current;
		expect(callback).not.toHaveBeenCalled();

		debouncedCallback(1);
		expect(callback).not.toHaveBeenCalled();
		jest.advanceTimersByTime(299);
		expect(callback).not.toHaveBeenCalled();
		jest.runAllTimers();
		expect(callback).toHaveBeenCalledTimes(1);
		expect(callback).toHaveBeenCalledWith(1);

		debouncedCallback(2);
		debouncedCallback(3);
		debouncedCallback(4);
		expect(callback).toHaveBeenCalledTimes(1);

		jest.advanceTimersByTime(300);

		expect(callback).toHaveBeenCalledTimes(2);
		expect(callback).toHaveBeenCalledWith(4);
	});
});
