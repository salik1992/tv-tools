import type { FocusEvent, KeyboardEvent, PropsWithChildren } from 'react';
import { useCallback } from 'react';
import { isDirectional } from '@salik1992/tv-tools/control';
import { focus } from '@salik1992/tv-tools/focus';

/**
 * The main root component for the focus management.
 * It creates a div element that is used for listening to key events in the manager.
 * Use at the root of your application.
 */
export const FocusRoot = ({
	children,
	/** Use this to prevent TV use their own navigation. */
	alwaysPreventNavigationalEvents,
}: PropsWithChildren<{
	alwaysPreventNavigationalEvents?: boolean;
}>) => {
	const onFocus = useCallback((event: FocusEvent) => {
		focus.handleFocusEvent(event.nativeEvent);
	}, []);

	const keyDownCapture = useCallback((event: KeyboardEvent<HTMLElement>) => {
		focus.handleKeyEvent('keydown', 'capture', event);
	}, []);

	const keyDownBubble = useCallback((event: KeyboardEvent<HTMLElement>) => {
		focus.handleKeyEvent('keydown', 'bubble', event);
		if (
			alwaysPreventNavigationalEvents &&
			isDirectional(event) &&
			document.activeElement?.tagName !== 'INPUT'
		) {
			event.preventDefault();
			event.stopPropagation();
		}
	}, []);

	const keyUpCapture = useCallback((event: KeyboardEvent<HTMLElement>) => {
		focus.handleKeyEvent('keyup', 'capture', event);
	}, []);

	const keyUpBubble = useCallback((event: KeyboardEvent<HTMLElement>) => {
		focus.handleKeyEvent('keyup', 'bubble', event);
		if (
			alwaysPreventNavigationalEvents &&
			isDirectional(event) &&
			document.activeElement?.tagName !== 'INPUT'
		) {
			event.preventDefault();
			event.stopPropagation();
		}
	}, []);

	return (
		<div
			id="focusRoot"
			onFocus={onFocus}
			onKeyDownCapture={keyDownCapture}
			onKeyDown={keyDownBubble}
			onKeyUpCapture={keyUpCapture}
			onKeyUp={keyUpBubble}
		>
			{children}
		</div>
	);
};
