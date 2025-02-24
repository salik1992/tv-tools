import type { PropsWithChildren, KeyboardEvent } from 'react';
import { useCallback } from 'react';
import { focus } from '@salik1992/tv-tools/focus';

/**
 * The main root component for the focus management.
 * It creates a div element that is used for listening to key events in the manager.
 * Use at the root of your application.
 */
export const FocusRoot = ({ children }: PropsWithChildren) => {
	const keyDownCapture = useCallback((event: KeyboardEvent<HTMLElement>) => {
		focus.handleKeyEvent('keydown', 'capture', event);
	}, []);

	const keyDownBubble = useCallback((event: KeyboardEvent<HTMLElement>) => {
		focus.handleKeyEvent('keydown', 'bubble', event);
	}, []);

	const keyUpCapture = useCallback((event: KeyboardEvent<HTMLElement>) => {
		focus.handleKeyEvent('keyup', 'capture', event);
	}, []);

	const keyUpBubble = useCallback((event: KeyboardEvent<HTMLElement>) => {
		focus.handleKeyEvent('keyup', 'bubble', event);
	}, []);

	return (
		<div
			id="focusRoot"
			onKeyDownCapture={keyDownCapture}
			onKeyDown={keyDownBubble}
			onKeyUpCapture={keyUpCapture}
			onKeyUp={keyUpBubble}
		>
			{children}
		</div>
	);
};
