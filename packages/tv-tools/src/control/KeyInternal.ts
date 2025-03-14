import type { KeyInformation, Key, KeyOption } from './types';

/**
 * Returns whether the document is in right to left layout.
 * @returns true for 'rtl', false otherwise
 */
function isRtl() {
	return document.documentElement.dir === 'rtl';
}

/**
 * Implementation of the Key class for easier manipulation with key and their
 * alternatives.
 */
export class KeyInternal implements Key {
	constructor(
		/**
		 * All the keycodes that should be matched to this Key.
		 */
		public keyCodes: number[],
		/**
		 * All the codes that should be matched to this Key.
		 */
		public codes: string[],
		/**
		 * All the keycodes that should be matched to this Key when in rtl layout.
		 * Keeping this undefined will use normal keyCodes.
		 */
		public rtlKeyCodes?: number[],
		/**
		 * All the codes that should be matched to this Key when in rtl layout.
		 * Keeping this undefined will use normal codes.
		 */
		public rtlCodes?: string[],
	) {}

	/**
	 * Function to test whether the key event is belonging to this Key.
	 * @param event - event to test
	 * @param options - optional options for test
	 * - ignoreRtl - it will override to always use ltr keycodes/codes
	 * @returns true if the Key is the one from the event.
	 * @example
	 * ```typescript
	 * const onKeyDown = (event: KeyboardEvent) => {
	 *     if (LEFT.is(event)) {
	 *         moveFocus(-1)
	 *     } else if (RIGHT.is(event)) {
	 *         moveFocus(1)
	 *     } else (ENTER.is(event)) {
	 *         navigateToDetail()
	 *     }
	 * }
	 * ```
	 */
	is<T extends KeyInformation>(
		event: T,
		{ ignoreRtl = false }: KeyOption = {},
	) {
		const rtl = isRtl();
		const keyCodes =
			rtl && !ignoreRtl && this.rtlKeyCodes
				? this.rtlKeyCodes
				: this.keyCodes;
		const codes =
			rtl && !ignoreRtl && this.rtlCodes ? this.rtlCodes : this.codes;
		return (
			(!!event.keyCode && keyCodes.includes(event.keyCode)) ||
			(!!event.code && codes.includes(event.code))
		);
	}

	/**
	 * Converts the Key to a KeyboardEvent.
	 * Mostly only for testing purposes.
	 * @param type - type of the event (keydown, keyup)
	 * @param options - optional changes to the event
	 * - rtl - use rtlKeyCodes and rtlCodes, if defined
	 * @returns KeyboardEvent to use for dispatchEvent
	 */
	toKeyboardEvent(
		type: KeyboardEvent['type'],
		{ rtl = false }: { rtl?: boolean } = {},
	): KeyboardEvent {
		return new KeyboardEvent(type, {
			code: rtl && this.rtlCodes ? this.rtlCodes[0] : this.codes[0],
			keyCode:
				rtl && this.rtlKeyCodes
					? this.rtlKeyCodes[0]
					: this.keyCodes[0],
			bubbles: true,
		});
	}

	/**
	 * Converts the Key object to string. Not published in the Key interface
	 * but used automatically in JS if used like this.
	 * ```typescript
	 * `${LEFT}` // --> "[ArrowLeft]"
	 * ```
	 */
	toString() {
		return `[${this.codes[0]}]`;
	}
}
