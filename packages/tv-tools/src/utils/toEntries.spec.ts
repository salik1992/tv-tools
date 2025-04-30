import { toEntries } from './toEntries';

describe('toEntries', () => {
	it('converts the keys of an object to array of tuples', () => {
		expect(toEntries({ a: 1, b: 2, c: 3 })).toEqual([
			['a', 1],
			['b', 2],
			['c', 3],
		]);
	});

	it('converts only instance keys not prototype properties', () => {
		class Test {
			public prototypeFunction() {}
			public instanceFunction = () => {};
		}
		expect(toEntries(new Test())).toEqual([
			['instanceFunction', expect.any(Function)],
		]);
	});
});
