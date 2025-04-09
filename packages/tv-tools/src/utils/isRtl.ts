/**
 * Returns whether the document is in right to left layout.
 * @returns true for 'rtl', false otherwise
 */
export function isRtl() {
	return document.documentElement.dir === 'rtl';
}
