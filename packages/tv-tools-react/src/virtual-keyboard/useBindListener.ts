import { useEffect } from 'react';
import type {
	VirtualKeyboard,
	VirtualKeyboardEvents,
} from '@salik1992/tv-tools/virtual-keyboard';

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
