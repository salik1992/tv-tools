import { PropsWithChildren } from 'react';
import { act, render } from '@testing-library/react';
import { ENTER } from '@salik1992/tv-tools/control';
import { backspace, done, layout } from '@salik1992/tv-tools/virtual-keyboard';
import { FocusRoot, Interactable } from '../focus';
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
			{ wrapper: FocusRoot },
		);

		act(() => {
			const jKey = container.querySelector('#keyboard-vk-j');
			jKey?.dispatchEvent(ENTER.toKeyboardEvent('keydown'));
			jest.runAllTimers();
		});
		expect(onAddChar).toHaveBeenCalledWith('j');

		act(() => {
			const backspaceKey = container.querySelector(
				'#keyboard-vk-backspace',
			);
			backspaceKey?.dispatchEvent(ENTER.toKeyboardEvent('keydown'));
			jest.runAllTimers();
		});
		expect(onRemoveChar).toHaveBeenCalled();

		act(() => {
			const doneKey = container.querySelector('#keyboard-vk-done');
			doneKey?.dispatchEvent(ENTER.toKeyboardEvent('keydown'));
			jest.runAllTimers();
		});
		expect(onDone).toHaveBeenCalled();

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
			{ wrapper: FocusRoot },
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
