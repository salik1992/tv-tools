import { renderHook } from '@testing-library/react';
import {
	BLUE,
	GREEN,
	type Key,
	RED,
	YELLOW,
} from '@salik1992/tv-tools/control';
import { type ControlEvent, focus } from '@salik1992/tv-tools/focus';
import { useKeySequenceListener } from './useKeySequenceListener';

const press = (key: Key) => {
	focus.handleKeyEvent(
		'keydown',
		'bubble',
		key.toKeyboardEvent('keydown') as ControlEvent,
	);
};

describe('useKeySequenceListener', () => {
	it('should return a callback', () => {
		const callback = jest.fn();
		const { unmount } = renderHook(() =>
			useKeySequenceListener(
				[RED, YELLOW, GREEN, BLUE, YELLOW],
				callback,
				[],
			),
		);
		press(RED);
		expect(callback).not.toHaveBeenCalled();
		press(YELLOW);
		expect(callback).not.toHaveBeenCalled();
		press(GREEN);
		expect(callback).not.toHaveBeenCalled();
		press(BLUE);
		expect(callback).not.toHaveBeenCalled();
		press(YELLOW);
		expect(callback).toHaveBeenCalled();

		callback.mockClear();
		unmount();

		press(RED);
		press(YELLOW);
		press(GREEN);
		press(BLUE);
		press(YELLOW);
		expect(callback).not.toHaveBeenCalled();
	});
});
