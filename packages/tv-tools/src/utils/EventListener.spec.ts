import { logger } from '../logger';
import { EventListener } from './EventListener';
import { noop } from './noop';

jest.useFakeTimers();

describe('EventListener', () => {
	const events = new EventListener<{ test: number; unused: void }>();
	const test = jest.fn();
	const unused = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should add event listeners', () => {
		expect(() => events.addEventListener('test', test)).not.toThrow();
		expect(() => events.addEventListener('unused', unused)).not.toThrow();
	});

	it('should trigger only appropriate listener', () => {
		events.triggerEvent('test', 1);
		jest.runAllTimers();
		expect(test).toHaveBeenCalledWith(1);
		expect(unused).not.toHaveBeenCalled();
	});

	it('should remove event listeners', () => {
		events.removeEventListener('test', test);
		events.removeEventListener('unused', unused);
		events.triggerEvent('test', 1);
		events.triggerEvent('unused');
		expect(test).not.toHaveBeenCalled();
		expect(unused).not.toHaveBeenCalled();
	});

	it('should not fail if listeners error out', () => {
		const spy = jest.spyOn(logger, 'error').mockImplementation(noop);
		const error = new Error();
		const errorListener = jest.fn(() => {
			throw error;
		});
		events.addEventListener('test', errorListener);
		events.triggerEvent('test', 2);
		jest.runAllTimers();
		expect(errorListener).toHaveBeenCalledWith(2);
		expect(spy).toHaveBeenCalledWith('EventListener', error);
		spy.mockRestore();
	});
});
