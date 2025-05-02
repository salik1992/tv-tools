import type { PropsWithChildren } from 'react';
import { act, render } from '@testing-library/react';
import { BACK, ENTER, type Key } from '@salik1992/tv-tools/control';
import { backspace, done, layout } from '@salik1992/tv-tools/virtual-keyboard';
import { FocusProvider, Interactable } from '../focus';
import { VirtualKeyboard } from './VirtualKeyboard';

jest.useFakeTimers();

const LAYOUTS = {
	base: {
		initialKey: 'a',
		keys: [
			['a', 'b', 'c', 'd', 'e'],
			['f', 'g', 'h', 'i', 'j'],
			['k', 'l', 'm', 'n', 'o'],
			['p', 'q', 'r', 's', 't'],
			['u', 'v', 'w', 'x', 'y'],
			[
				'z',
				{ key: 'space', char: ' ' },
				{ key: 'dot', char: '.' },
				{ key: 'backspace', label: 'DEL', action: backspace },
				{ key: 'done', label: 'DONE', action: done },
			],
		],
	},
};

const Keyboard = ({ children }: PropsWithChildren) => (
	<div className="keyboard">{children}</div>
);

const Row = ({ children }: PropsWithChildren) => (
	<div className="row">{children}</div>
);

const expectPressResultBase =
	(container: HTMLElement) =>
	(
		keyId: string,
		keyOrEvent: Key | KeyboardEvent,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		listener: jest.MockedFn<any>,
		params: unknown[],
		negative = false,
	) => {
		act(() => {
			const key = container.querySelector(`#keyboard-vk-${keyId}`);
			const event =
				keyOrEvent instanceof KeyboardEvent
					? keyOrEvent
					: keyOrEvent.toKeyboardEvent('keydown');
			key?.dispatchEvent(event);
			jest.runAllTimers();
		});
		if (negative) {
			expect(listener).not.toHaveBeenCalled();
		} else {
			expect(listener).toHaveBeenCalledWith(...params);
		}
	};

describe('VirtualKeyboard', () => {
	it('should render the keyboard', () => {
		const { container, unmount } = render(
			<VirtualKeyboard
				id="keyboard"
				layouts={LAYOUTS}
				Keyboard={Keyboard}
				Row={Row}
				Key={Interactable}
			/>,
			{ wrapper: FocusProvider },
		);
		expect(container).toMatchSnapshot();
		unmount();
	});

	it('should receive info from keyboard', () => {
		const onAddChar = jest.fn();
		const onRemoveChar = jest.fn();
		const onDone = jest.fn();

		const { container, unmount } = render(
			<VirtualKeyboard
				id="keyboard"
				layouts={LAYOUTS}
				Keyboard={Keyboard}
				Row={Row}
				Key={Interactable}
				onAddChar={onAddChar}
				onRemoveChar={onRemoveChar}
				onDone={onDone}
			/>,
			{ wrapper: FocusProvider },
		);
		const expectPressResult = expectPressResultBase(container);

		expectPressResult('j', ENTER, onAddChar, ['j']);
		expectPressResult('backspace', ENTER, onRemoveChar, [undefined]);
		expectPressResult(
			'backspace',
			new KeyboardEvent('keydown', { bubbles: true, key: 'T' }),
			onAddChar,
			['T'],
		);

		onAddChar.mockClear();

		expectPressResult(
			'backspace',
			new KeyboardEvent('keydown', { bubbles: true, key: 'Shift' }),
			onAddChar,
			[undefined],
			true,
		);
		expectPressResult('done', ENTER, onDone, [undefined]);

		onDone.mockClear();

		expectPressResult('space', BACK, onDone, [undefined]);

		unmount();
	});

	it('should render various layouts', () => {
		const { container, unmount } = render(
			<VirtualKeyboard
				id="keyboard"
				layouts={{
					abc: {
						initialKey: 'a',
						keys: [
							['a', 'b', 'c'],
							[
								{
									key: 'numbers',
									label: '123',
									action: layout('numbers'),
								},
							],
						],
					},
					numbers: {
						initialKey: '1',
						keys: [
							['1', '2', '3'],
							[
								{
									key: 'abc',
									label: 'ABC',
									action: layout('abc'),
								},
							],
						],
					},
				}}
				Keyboard={Keyboard}
				Row={Row}
				Key={Interactable}
			/>,
			{ wrapper: FocusProvider },
		);

		expect(container.innerHTML).toContain('123');
		expect(container.innerHTML).not.toContain('ABC');

		act(() => {
			const abcKey = container.querySelector('#keyboard-vk-numbers');
			abcKey?.dispatchEvent(ENTER.toKeyboardEvent('keydown'));
			jest.runAllTimers();
		});

		expect(container.innerHTML).not.toContain('123');
		expect(container.innerHTML).toContain('ABC');

		act(() => {
			const abcKey = container.querySelector('#keyboard-vk-abc');
			abcKey?.dispatchEvent(ENTER.toKeyboardEvent('keydown'));
			jest.runAllTimers();
		});

		expect(container.innerHTML).toContain('123');
		expect(container.innerHTML).not.toContain('ABC');

		unmount();
	});
});
