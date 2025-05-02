import type { ComponentProps, FocusEvent, KeyboardEvent } from 'react';
import { useCallback, useMemo } from 'react';
import { isDirectional } from '@salik1992/tv-tools/control';
import { FocusManager } from '@salik1992/tv-tools/focus';
import { noop } from '@salik1992/tv-tools/utils/noop';
import { FocusContext } from './context';

/**
 * The main root component for the focus management.
 * It creates a div element that is used for listening to key events in the manager and
 * it also creates the focus manager instance for the application which is available through
 * the FocusContext or useFocusManager hook.
 * Use at the root of your application.
 * @prop alwaysPreventNavigationalEvents - Use this to prevent TV use their own navigation.
 * @prop ...props - Any other props that you want to pass to the wrapping div element.
 */
export const FocusProvider = ({
	children,
	alwaysPreventNavigationalEvents,
	onFocus: onOuterFocus,
	onKeyDownCapture: onOuterKeyDownCapture,
	onKeyDown: onOuterKeyDown,
	onKeyUpCapture: onOuterKeyUpCapture,
	onKeyUp: onOuterKeyUp,
	...props
}: ComponentProps<'div'> & {
	/** Use this to prevent TV use their own navigation. */
	alwaysPreventNavigationalEvents?: boolean;
}) => {
	const focusManager = useMemo(() => new FocusManager(), []);

	const onFocus = useCallback(
		(event: FocusEvent<HTMLDivElement>) => {
			focusManager.handleFocusEvent(event.nativeEvent);
			onOuterFocus?.(event);
		},
		[focusManager, onOuterFocus],
	);

	const keyDownCapture = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			focusManager.handleKeyEvent('keydown', 'capture', event);
			onOuterKeyDownCapture?.(event);
		},
		[focusManager, onOuterKeyDownCapture],
	);

	const keyDownBubble = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			focusManager.handleKeyEvent('keydown', 'bubble', event);
			if (
				alwaysPreventNavigationalEvents &&
				isDirectional(event) &&
				document.activeElement?.tagName !== 'INPUT'
			) {
				event.preventDefault();
				event.stopPropagation();
			} else {
				onOuterKeyDown?.(event);
			}
		},
		[focusManager, alwaysPreventNavigationalEvents, onOuterKeyDown],
	);

	const keyUpCapture = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			focusManager.handleKeyEvent('keyup', 'capture', event);
			onOuterKeyUpCapture?.(event);
		},
		[focusManager, onOuterKeyUpCapture],
	);

	const keyUpBubble = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			focusManager.handleKeyEvent('keyup', 'bubble', event);
			if (
				alwaysPreventNavigationalEvents &&
				isDirectional(event) &&
				document.activeElement?.tagName !== 'INPUT'
			) {
				event.preventDefault();
				event.stopPropagation();
			} else {
				onOuterKeyUp?.(event);
			}
		},
		[focusManager, alwaysPreventNavigationalEvents, onOuterKeyUp],
	);

	const focusContextValue = useMemo(
		() => ({
			focusManager,
			addChild: noop,
		}),
		[focusManager],
	);

	return (
		<div
			{...props}
			onFocus={onFocus}
			onKeyDownCapture={keyDownCapture}
			onKeyDown={keyDownBubble}
			onKeyUpCapture={keyUpCapture}
			onKeyUp={keyUpBubble}
		>
			<FocusContext.Provider value={focusContextValue}>
				{children}
			</FocusContext.Provider>
		</div>
	);
};
