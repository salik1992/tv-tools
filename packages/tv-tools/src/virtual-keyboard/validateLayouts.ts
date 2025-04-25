import {
	BACKSPACE,
	CAPS,
	DEL,
	DONE,
	END,
	HOME,
	LAYOUT,
	LEFT,
	RIGHT,
	SHIFT,
	SHIFT_AND_CAPS,
} from './constants';
import type { Key, VirtualKeyboardLayouts } from './types';

const ALLOWED_ACTIONS = [
	SHIFT,
	CAPS,
	SHIFT_AND_CAPS,
	BACKSPACE,
	DEL,
	LEFT,
	RIGHT,
	HOME,
	END,
	DONE,
	LAYOUT,
];

/**
 * Returns all key ids from the layout.
 * @param layout - The layout to get the keys from.
 * @returns An array of key ids.
 */
function getAllKeys(layout: (string | Key<string>)[][]) {
	const keys: string[] = [];
	for (const row of layout) {
		for (const key of row) {
			if (typeof key === 'string') {
				keys.push(key);
			} else if (typeof key === 'object') {
				keys.push(key.key);
			}
		}
	}
	return keys;
}

/**
 * Validates the layouts object.
 * @param layouts - The layouts object to validate.
 * @throws Will throw an error if the layouts object is invalid.
 */
export function validateLayouts(layouts: VirtualKeyboardLayouts) {
	if (!layouts) {
		throw new Error('Layouts are required');
	}
	if (typeof layouts !== 'object') {
		throw new Error('Layouts should be an object');
	}
	if (Object.keys(layouts).length === 0) {
		throw new Error('Layouts should not be empty');
	}
	for (const [layoutName, layout] of Object.entries(layouts)) {
		if (typeof layoutName !== 'string') {
			throw new Error(
				`Layout name should be a string, got ${layoutName}`,
			);
		}
		if (typeof layout !== 'object') {
			throw new Error(
				`Layout ${layoutName} should be an object, got ${layout}`,
			);
		}
		if (!Array.isArray(layout.keys)) {
			throw new Error(
				`Property "keys" of layout ${layoutName} should be an array, got ${layout.keys}`,
			);
		}
		for (const row of layout.keys) {
			if (!Array.isArray(row)) {
				throw new Error(
					`Layout ${layoutName} should be an array of arrays, got ${row}`,
				);
			}
			for (const key of row) {
				if (typeof key !== 'string' && typeof key !== 'object') {
					throw new Error(
						`Layout ${layoutName} should be an array of strings or objects, got ${key}`,
					);
				}
				if (typeof key === 'object') {
					if (typeof key.key !== 'string') {
						throw new Error(
							`The property "key" of Key in layout ${layoutName} should be a string, got ${key.key}`,
						);
					}
					if (
						key.colSpan !== undefined &&
						typeof key.colSpan !== 'number'
					) {
						throw new Error(
							`The property "colSpan" of Key in layout ${layoutName} should be a number, got ${key.colSpan}`,
						);
					}
					if (
						key.rowSpan !== undefined &&
						typeof key.rowSpan !== 'number'
					) {
						throw new Error(
							`The property "rowSpan" of Key in layout ${layoutName} should be a number, got ${key.rowSpan}`,
						);
					}
					if (
						key.label !== undefined &&
						typeof key.label !== 'string'
					) {
						throw new Error(
							`The property "label" of Key in layout ${layoutName} should be a string, got ${key.label}`,
						);
					}
					if (key.action !== undefined) {
						if (typeof key.action !== 'function') {
							throw new Error(
								`The property "action" of Key in layout ${layoutName} should be a function, got ${key.action}`,
							);
						}
						const { action, payload } = key.action();
						if (!ALLOWED_ACTIONS.includes(action)) {
							throw new Error(
								`The action "${action}" is not allowed in layout ${layoutName}`,
							);
						}
						if (action === LAYOUT) {
							if (typeof payload !== 'string') {
								throw new Error(
									`The payload of the action "${action}" should be a string, got ${payload}`,
								);
							}
							if (
								!Object.keys(layouts).includes(
									payload as string,
								)
							) {
								throw new Error(
									`The layout "${payload}" is not defined in the layouts object`,
								);
							}
						}
					}
				}
			}
		}
		if (
			layout.initialKey &&
			!getAllKeys(layout.keys).includes(layout.initialKey)
		) {
			throw new Error(
				`The initial key "${layout.initialKey}" is not defined in the layout ${layoutName}`,
			);
		}
	}
}
