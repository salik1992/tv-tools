import { toKeys } from './toKeys';

describe('toKeys', () => {
	it('converts the keys of an object to array of strings', () => {
		expect(toKeys({ a: 1, b: 2, c: 3 })).toEqual(['a', 'b', 'c']);
	});

	it('converts only instance keys not prototype properties', () => {
		class Test {
			prototypeFunction() {}
			instanceFunction = () => {};
		}
		expect(toKeys(new Test())).toEqual(['instanceFunction']);
	});
});
