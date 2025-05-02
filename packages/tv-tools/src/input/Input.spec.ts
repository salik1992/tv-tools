import { FocusManager, Interactable } from '../focus';
import { Input } from './Input';

jest.useFakeTimers();

describe('Input', () => {
	const focus = new FocusManager();
	const div = document.createElement('div');
	const interactable = new Interactable(focus, 'input');
	interactable.setElement(div);
	const input = new Input(focus, interactable);
	const element = document.createElement('input');
	const rdSpy = jest.fn();
	const activeElementSpy = jest.spyOn(document, 'activeElement', 'get');

	beforeAll(() => {
		input.addEventListener('renderData', rdSpy);
	});

	afterAll(() => {
		input.removeEventListener('renderData', rdSpy);
	});

	beforeEach(() => {
		rdSpy.mockClear();
	});

	it('should have default render data', () => {
		expect(input.getRenderData()).toEqual({
			type: 'char',
			active: false,
			placeholder: false,
			value: '',
			caret: 0,
			selection: null,
		});
	});

	it('should set input element', () => {
		const spy = jest.spyOn(element, 'addEventListener');
		input.setInputElement(element);
		expect(spy.mock.calls).toEqual([
			['blur', expect.any(Function)],
			['select', expect.any(Function)],
			['keyup', expect.any(Function)],
			['keydown', expect.any(Function)],
			['change', expect.any(Function)],
			['input', expect.any(Function)],
		]);
		spy.mockRestore();
	});

	it('should clean up input element when next one is passed', () => {
		const spy = jest.spyOn(element, 'removeEventListener');
		input.setInputElement(null);
		expect(spy.mock.calls).toEqual([
			['blur', expect.any(Function)],
			['select', expect.any(Function)],
			['keyup', expect.any(Function)],
			['keydown', expect.any(Function)],
			['change', expect.any(Function)],
			['input', expect.any(Function)],
		]);
		spy.mockRestore();
	});

	it('should setup input element again', () => {
		input.setInputElement(element);
	});

	it('should call focus the input element when interactable is pressed', () => {
		const spy = jest.spyOn(element, 'focus');
		activeElementSpy.mockReturnValue(element);
		focus.focus('input');
		focus.handleKeyEvent('keydown', 'bubble', {
			code: 'Enter',
			target: div,
			preventDefault: jest.fn(),
			stopPropagation: jest.fn(),
		});
		expect(spy).toHaveBeenCalled();
		spy.mockRestore();
		jest.runAllTimers();
		expect(rdSpy).toHaveBeenCalledWith(
			expect.objectContaining({ active: true }),
		);
	});

	it('should trigger render data when typing', () => {
		element.dispatchEvent(
			new KeyboardEvent('keydown', { bubbles: true, key: 'a' }),
		);
		element.value = 'a'; // jsdom doesn't update the value automatically
		jest.runAllTimers();
		expect(rdSpy).toHaveBeenCalledWith(
			expect.objectContaining({ value: 'a' }),
		);
	});

	it('should trigger render data on change', () => {
		element.value = 'bc';
		element.dispatchEvent(new InputEvent('change', { bubbles: true }));
		jest.runAllTimers();
		expect(rdSpy).toHaveBeenCalledWith(
			expect.objectContaining({ value: 'bc' }),
		);
	});

	it('should trigger render data on input', () => {
		element.value = 'def';
		element.dispatchEvent(new InputEvent('input', { bubbles: true }));
		jest.runAllTimers();
		expect(rdSpy).toHaveBeenCalledWith(
			expect.objectContaining({ value: 'def' }),
		);
	});

	it('should trigger render data on select', () => {
		element.value = '0123';
		element.selectionStart = 2;
		element.selectionDirection = 'backward';
		jest.runAllTimers();
		expect(rdSpy).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({
				value: '0123',
				caret: 2,
				selection: [2, 4],
			}),
		);
	});

	it('should focus interactable when finish input key is pressed', () => {
		const spy = jest.spyOn(div, 'focus');
		element.dispatchEvent(
			new KeyboardEvent('keyup', { bubbles: true, code: 'Escape' }),
		);
		expect(spy).toHaveBeenCalledWith({ preventScroll: true });
		spy.mockRestore();
	});

	it('should trigger render data on blur', () => {
		activeElementSpy.mockReturnValue(div);
		element.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
		jest.runAllTimers();
		expect(rdSpy).toHaveBeenCalledWith(
			expect.objectContaining({ active: false }),
		);
	});

	it('should clean up input element on destroy', () => {
		const spy = jest.spyOn(element, 'removeEventListener');
		input.destroy();
		expect(spy.mock.calls).toEqual([
			['blur', expect.any(Function)],
			['select', expect.any(Function)],
			['keyup', expect.any(Function)],
			['keydown', expect.any(Function)],
			['change', expect.any(Function)],
			['input', expect.any(Function)],
		]);
		spy.mockRestore();
	});
});
