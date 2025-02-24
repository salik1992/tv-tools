/**
 * UUIDv4 generator.
 * @returns UUIDv4 string
 */
export function uuidV4() {
	let id = '';
	for (let i = 0; i < 32; i++) {
		const random = (Math.random() * 16) | 0;
		if (i === 8 || i === 12 || i === 16 || i === 20) {
			id += '-';
		}
		id += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(
			16,
		);
	}
	return id;
}
