import { renderHook, act } from '@testing-library/react';
import { useRefresh } from './useRefresh';

describe('useRefresh', () => {
	it('should return a refresh function', () => {
		const { result } = renderHook(() => useRefresh());
		const firstRefresh = result.current;
		act(() => {
			firstRefresh();
		});
		const secondRefresh = result.current;
		expect(firstRefresh).not.toBe(secondRefresh);
	});
});
