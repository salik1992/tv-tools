import { TableFocusContainer } from '../focus';
import { VirtualKeyboard } from './VirtualKeyboard';
import {
	backspace,
	caps,
	del,
	done,
	end,
	home,
	layout,
	left,
	right,
	shift,
	shiftAndCaps,
} from './constants';
import { Key } from './types';

jest.useFakeTimers();

const LAYOUT = {
	abc: {
		initialKey: 'n',
		keys: [
			['a', 'b', 'c'],
			['d', 'e', 'f'],
			['g', 'h', 'i'],
			['j', 'k', 'l'],
			['m', 'n', 'o'],
			['p', 'q', 'r'],
			['s', 't', 'u'],
			['v', 'w', 'x'],
			['y', 'z', { key: '123', action: layout('numbers') }],
		],
	},
	numbers: {
		initialKey: '5',
		keys: [
			['1', '2', '3'],
			['4', '5', '6'],
			['7', '8', '9'],
			[
				{ key: '0' },
				{ key: 'backspace', action: backspace },
				{ key: 'abc', action: layout('abc') },
			],
			[
				{ key: 'del', action: del },
				{ key: 'shift', action: shift },
				{ key: 'caps', action: caps },
				{ key: 'shiftAndCaps', action: shiftAndCaps },
				{ key: 'left', action: left },
				{ key: 'right', action: right },
				{ key: 'home', action: home },
				{ key: 'end', action: end },
				{ key: 'done', action: done },
			],
		],
	},
};

describe('VirtualKeyboard', () => {
	const container = new TableFocusContainer();
	const virtualKeyboard = new VirtualKeyboard(LAYOUT, container);

	const getKeyById = (id: string) => {
		for (const row of virtualKeyboard.getRenderData().layout) {
			for (const key of row) {
				if (typeof key === 'object' && key.key === id) {
					return key;
				}
			}
		}
		return null;
	};

	describe('standalone', () => {
		it('should return full render data', () => {
			expect(virtualKeyboard.getRenderData()).toEqual({
				effect: undefined,
				layoutName: 'abc',
				layout: LAYOUT.abc.keys.map((row) =>
					row.map((key) => {
						const char = (key as Key<string>).key ?? key;
						return {
							key: char,
							colSpan: 1,
							rowSpan: 1,
							label: char,
							focusOnMount: char === LAYOUT.abc.initialKey,
							onPress: expect.any(Function),
						};
					}),
				),
			});
		});

		it('should trigger "addChar" event when key is pressed', () => {
			const addChar = jest.fn();
			virtualKeyboard.addEventListener('addChar', addChar);
			const jKey = getKeyById('j');
			jKey?.onPress();
			jest.runAllTimers();
			expect(addChar).toHaveBeenCalledWith('j');
			virtualKeyboard.removeEventListener('addChar', addChar);
		});

		it('should trigger "renderData" event when layout is changed', () => {
			const renderData = jest.fn();
			virtualKeyboard.addEventListener('renderData', renderData);
			const layoutKey = getKeyById('123');
			layoutKey?.onPress();
			jest.runAllTimers();
			expect(renderData).toHaveBeenCalledWith({
				effect: undefined,
				layoutName: 'numbers',
				layout: LAYOUT.numbers.keys.map((row) =>
					row.map((key) => {
						const char = (key as Key<string>).key ?? key;
						return {
							key: char,
							colSpan: 1,
							rowSpan: 1,
							label: char,
							focusOnMount: char === LAYOUT.numbers.initialKey,
							onPress: expect.any(Function),
						};
					}),
				),
			});
			virtualKeyboard.removeEventListener('renderData', renderData);
		});

		it('should trigger "removeChar" event when backspace is pressed', () => {
			const removeChar = jest.fn();
			virtualKeyboard.addEventListener('removeChar', removeChar);
			const backspaceKey = getKeyById('backspace');
			backspaceKey?.onPress();
			jest.runAllTimers();
			expect(removeChar).toHaveBeenCalled();
			virtualKeyboard.removeEventListener('removeChar', removeChar);
		});

		it('should trigger "done" event when done is pressed', () => {
			const done = jest.fn();
			virtualKeyboard.addEventListener('done', done);
			const doneKey = getKeyById('done');
			doneKey?.onPress();
			jest.runAllTimers();
			expect(done).toHaveBeenCalled();
			virtualKeyboard.removeEventListener('done', done);
		});

		it('should switch between shift and none effect with shift', () => {
			const shiftKey = getKeyById('shift');
			shiftKey?.onPress();
			jest.runAllTimers();
			expect(virtualKeyboard.getRenderData().effect).toBe('shift');
			shiftKey?.onPress();
			jest.runAllTimers();
			expect(virtualKeyboard.getRenderData().effect).toBe(undefined);
		});

		it('should switch between caps and none effect with caps', () => {
			const capsKey = getKeyById('caps');
			capsKey?.onPress();
			jest.runAllTimers();
			expect(virtualKeyboard.getRenderData().effect).toBe('caps');
			capsKey?.onPress();
			jest.runAllTimers();
			expect(virtualKeyboard.getRenderData().effect).toBe(undefined);
		});

		it('should switch between shift, caps and none effect with shiftAndCaps', () => {
			const shiftAndCapsKey = getKeyById('shiftAndCaps');
			shiftAndCapsKey?.onPress();
			jest.runAllTimers();
			expect(virtualKeyboard.getRenderData().effect).toBe('shift');
			shiftAndCapsKey?.onPress();
			jest.runAllTimers();
			expect(virtualKeyboard.getRenderData().effect).toBe('caps');
			shiftAndCapsKey?.onPress();
			jest.runAllTimers();
			expect(virtualKeyboard.getRenderData().effect).toBe(undefined);
		});

		it('should cancel effect when switching layout', () => {
			const numbersKey = getKeyById('123');
			const abcKey = getKeyById('abc');
			const shiftAndCapsKey = getKeyById('shiftAndCaps');
			const renderData = jest.fn();
			virtualKeyboard.addEventListener('renderData', renderData);
			shiftAndCapsKey?.onPress();
			jest.runAllTimers();
			expect(renderData).toHaveBeenCalledWith(
				expect.objectContaining({ effect: 'shift' }),
			);
			abcKey?.onPress();
			jest.runAllTimers();
			expect(renderData).toHaveBeenCalledWith(
				expect.objectContaining({ effect: undefined }),
			);
			numbersKey?.onPress();
			shiftAndCapsKey?.onPress();
			shiftAndCapsKey?.onPress();
			jest.runAllTimers();
			expect(renderData).toHaveBeenCalledWith(
				expect.objectContaining({ effect: 'caps' }),
			);
			abcKey?.onPress();
			jest.runAllTimers();
			expect(renderData).toHaveBeenCalledWith(
				expect.objectContaining({ effect: undefined }),
			);
			virtualKeyboard.removeEventListener('renderData', renderData);
		});

		it('should react to HW keyboard events and type printable characters', () => {
			const addChar = jest.fn();
			virtualKeyboard.addEventListener('addChar', addChar);
			const eventControl = new KeyboardEvent('keydown', { key: 'Shift' });
			virtualKeyboard.onKeyDown(eventControl);
			const eventPrintable = new KeyboardEvent('keydown', { key: 'a' });
			virtualKeyboard.onKeyDown(eventPrintable);
			jest.runAllTimers();
			expect(addChar.mock.calls).toEqual([['a']]);
			virtualKeyboard.removeEventListener('addChar', addChar);
		});
	});

	describe('with input', () => {
		const input = document.createElement('input');

		beforeAll(() => {
			virtualKeyboard.assignInput(input);
			const abcKey = getKeyById('abc');
			abcKey?.onPress();
		});

		afterAll(() => {
			virtualKeyboard.assignInput(undefined);
		});

		it('should type into the input when keys are pressed', () => {
			const hKey = getKeyById('h');
			const eKey = getKeyById('e');
			const lKey = getKeyById('l');
			const oKey = getKeyById('o');
			hKey?.onPress();
			eKey?.onPress();
			lKey?.onPress();
			lKey?.onPress();
			oKey?.onPress();
			expect(input.value).toBe('hello');
		});

		it('should move to the input start when home is pressed', () => {
			const layoutKey = getKeyById('123');
			layoutKey?.onPress();
			const homeKey = getKeyById('home');
			homeKey?.onPress();
			expect(input.selectionStart).toBe(0);
		});

		it('should delete the last character when del is pressed', () => {
			const delKey = getKeyById('del');
			delKey?.onPress();
			expect(input.value).toBe('ello');
		});

		it('should move to the input end when end is pressed', () => {
			const endKey = getKeyById('end');
			endKey?.onPress();
			expect(input.selectionStart).toBe(input.value.length);
			expect(input.selectionEnd).toBe(input.value.length);
		});

		it('should delete the last character when backspace is pressed', () => {
			const backspaceKey = getKeyById('backspace');
			backspaceKey?.onPress();
			expect(input.value).toBe('ell');
			backspaceKey?.onPress();
			expect(input.value).toBe('el');
			backspaceKey?.onPress();
			expect(input.value).toBe('e');
			backspaceKey?.onPress();
			expect(input.value).toBe('');
		});

		it('should type numbers', () => {
			const oneKey = getKeyById('1');
			const twoKey = getKeyById('2');
			const threeKey = getKeyById('3');
			oneKey?.onPress();
			twoKey?.onPress();
			threeKey?.onPress();
			threeKey?.onPress();
			twoKey?.onPress();
			oneKey?.onPress();
			expect(input.value).toBe('123321');
		});

		it('should move left with left key', () => {
			const leftKey = getKeyById('left');
			leftKey?.onPress();
			leftKey?.onPress();
			const backspaceKey = getKeyById('backspace');
			backspaceKey?.onPress();
			expect(input.value).toBe('12321');
		});

		it('should move right with right key', () => {
			const rightKey = getKeyById('right');
			rightKey?.onPress();
			const backspaceKey = getKeyById('backspace');
			backspaceKey?.onPress();
			expect(input.value).toBe('1231');
		});

		it('should react to HW keyboard events and type printable characters', () => {
			const eventControl = new KeyboardEvent('keydown', { key: 'Shift' });
			virtualKeyboard.onKeyDown(eventControl);
			const eventPrintable = new KeyboardEvent('keydown', { key: 'a' });
			virtualKeyboard.onKeyDown(eventPrintable);
			expect(input.value).toBe('123a1');
		});
	});
});
