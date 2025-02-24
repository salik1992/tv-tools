import { noop } from './noop';

describe('noop', () => {
	it('should return undefined', () => {
		expect(noop([1, 2, 3])).toBeUndefined();
	});
});
