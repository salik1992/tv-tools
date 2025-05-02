import type { PropsWithChildren } from 'react';
import { createRef } from 'react';
import { renderHook } from '@testing-library/react';
import {
	BLUE,
	GREEN,
	type Key,
	RED,
	YELLOW,
} from '@salik1992/tv-tools/control';
import type { ControlEvent, FocusManager } from '@salik1992/tv-tools/focus';
import { FocusProvider } from './FocusProvider';
import { ExposeFocusManager } from './mocks';
import { useKeySequenceListener } from './useKeySequenceListener';

const focusManager = createRef<FocusManager>();
const press = (key: Key) => {
	focusManager.current?.handleKeyEvent(
		'keydown',
		'bubble',
		key.toKeyboardEvent('keydown') as ControlEvent,
	);
};
const Wrapper = ({ children }: PropsWithChildren) => (
	<FocusProvider>
		{children}
		<ExposeFocusManager focusManager={focusManager} />
	</FocusProvider>
);

describe('useKeySequenceListener', () => {
	it('should return a callback', () => {
		const callback = jest.fn();
		const { unmount } = renderHook(
			() =>
				useKeySequenceListener(
					[RED, YELLOW, GREEN, BLUE, YELLOW],
					callback,
					[],
				),
			{ wrapper: Wrapper },
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
