/**
 * Clamps the value between min and max.
 * @param min - the minimum value
 * @param value - the value to clamp
 * @param max - the maximum value
 * @returns number clamped between min and max
 */
export function clamp(min: number, value: number, max: number) {
	return Math.max(min, Math.min(value, max));
}
