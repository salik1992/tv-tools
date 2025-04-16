/**
 * Shorthand for Object.keys which also keeps the typing correctly.
 * @param o - object which keys to convert to Array
 * @returns keys as array typed to (keyof typeof o)[]
 */
export function toEntries<T extends object>(o: T): [keyof T, T[keyof T]][] {
	return Object.entries(o) as [keyof T, T[keyof T]][];
}
