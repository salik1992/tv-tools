import { uuidV4 } from './uuidV4';

describe('uuidV4', () => {
	it('matches the regex', () => {
		expect(uuidV4()).toMatch(
			/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
		);
	});
});
