import { useEffect } from 'react';
import type {
	VirtualKeyboard,
	VirtualKeyboardEvents,
} from '@salik1992/tv-tools/virtual-keyboard';

/**
 * useBindListener is a custom hook that binds a listener to a virtual keyboard event.
 * The listener can be undefined, in which case it will not be bound.
 *
 * @param eventName - The name of the event to listen for.
 * @param keyboard - The virtual keyboard instance to bind the listener to.
 * @param callback - The listener function to call when the event is triggered.
 */
export function useBindListener<EventName extends keyof VirtualKeyboardEvents>(
	eventName: EventName,
	keyboard: VirtualKeyboard,
	callback:
		| (VirtualKeyboardEvents[typeof eventName] extends never
				? () => void
				: (payload: VirtualKeyboardEvents[typeof eventName]) => void)
		| undefined,
) {
	useEffect(() => {
		if (typeof callback === 'function') {
			keyboard.addEventListener(eventName, callback);
		}
		return () => {
			if (typeof callback === 'function') {
				keyboard.removeEventListener(eventName, callback);
			}
		};
	}, [keyboard, eventName, callback]);
}
