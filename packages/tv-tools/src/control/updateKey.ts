import type { Key } from './types';
import { KeyInternal } from './KeyInternal';

/**
 * Checks that the passed object is KeyInternal instance and it is
 * therefore safe to manipulate the keyCodes and codes.
 */
function assertKeyInternal(key: Key): asserts key is KeyInternal {
	if (!(key instanceof KeyInternal)) {
		throw new Error('Passed key is not a supported key.');
	}
}

/**
 * Function to adjust the keyCodes and codes used by the Key.
 * It is needed for various platforms as many do not share the same codes.
 * @example
 * ```typescript
 * // tizen driver
 * updateKey(BACK, { keyCodes: [10008] })
 * ```
 */
export function updateKey(
	key: Key,
	updates: {
		keyCodes?: number[];
		codes?: string[];
		rtlKeyCodes?: number[];
		rtlCodes?: string[];
	},
) {
	assertKeyInternal(key);
	if (Array.isArray(updates.keyCodes)) {
		key.keyCodes = updates.keyCodes;
	}
	if (Array.isArray(updates.codes)) {
		key.codes = updates.codes;
	}
	if (Object.prototype.hasOwnProperty.apply(updates, ['rtlKeyCodes'])) {
		key.rtlKeyCodes = updates.rtlKeyCodes;
	}
	if (Object.prototype.hasOwnProperty.apply(updates, ['rtlCodes'])) {
		key.rtlCodes = updates.rtlCodes;
	}
}
