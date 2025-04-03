import { runAsync } from './runAsync';

jest.useFakeTimers();

describe('runAsync', () => {
	it('should run the function after the execution stack', () => {
		const fn = jest.fn();
		fn('1');
		fn('2');
		runAsync(() => fn('3'));
		fn('4');
		jest.runAllTimers();
		expect(fn.mock.calls).toEqual([['1'], ['2'], ['4'], ['3']]);
	});
});
