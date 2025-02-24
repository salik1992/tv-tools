/**
 * Shorthand for Object.keys which also keeps the typing correctly.
 * @param o - object which keys to convert to Array
 * @returns keys as array typed to (keyof typeof o)[]
 */
export function toKeys<T extends {}>(o: T): (keyof T)[] {
	return Object.keys(o) as (keyof T)[];
}
