import { Keys } from './Keys';
import type { KeyInformation } from './types';

/**
 * Checks whether the passed event belongs to a directional key. (LEFT, RIGHT, UP, DOWN)
 * @param event - event to check
 * @returns true if it is one of LEFT, RIGHT, UP, DOWN; false otherwise
 */
export function isDirectional<T extends KeyInformation>(event: T): boolean {
	return (
		Keys.LEFT.is(event) ||
		Keys.RIGHT.is(event) ||
		Keys.UP.is(event) ||
		Keys.DOWN.is(event)
	);
}

/**
 * Checks whether the passed event belongs to a vertical key. (UP, DOWN)
 * @param event - event to check
 * @returns true if it is one of UP, DOWN; false otherwise
 */
export function isVertical<T extends KeyInformation>(event: T): boolean {
	return Keys.UP.is(event) || Keys.DOWN.is(event);
}

/**
 * Checks whether the passed event belongs to a horizontal key. (LEFT, RIGHT)
 * @param event - event to check
 * @returns true if it is one of LEFT, RIGHT; false otherwise
 */
export function isHorizontal<T extends KeyInformation>(event: T): boolean {
	return Keys.LEFT.is(event) || Keys.RIGHT.is(event);
}
