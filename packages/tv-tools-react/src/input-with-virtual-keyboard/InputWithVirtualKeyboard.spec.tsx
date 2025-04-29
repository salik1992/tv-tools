import {
	type ChangeEvent,
	type ComponentProps,
	type PropsWithChildren,
	useCallback,
	useState,
} from 'react';
import { act, render } from '@testing-library/react';
import { ENTER } from '@salik1992/tv-tools/control';
import {
	backspace,
	del,
	done,
	end,
	home,
	left,
	right,
} from '@salik1992/tv-tools/virtual-keyboard';
import { FocusRoot, Interactable } from '../focus';
import { VirtualKeyboard } from '../virtual-keyboard';
import { InputWithVirtualKeyboard } from './InputWithVirtualKeyboard';
import { VirtualKeyboardProvider } from './VirtualKeyboardContainer';

jest.useFakeTimers();

// @ts-expect-error: mock
Range.prototype.getBoundingClientRect = jest.fn(() => ({
	left: 100,
	top: 0,
	right: 0,
	bottom: 0,
	width: 25,
	height: 0,
	x: 0,
	y: 0,
}));

const Providers = ({ children }: PropsWithChildren) => (
	<FocusRoot>
		<VirtualKeyboardProvider className="keyboard-wrapper">
			{children}
		</VirtualKeyboardProvider>
	</FocusRoot>
);

const KeyboardBody = ({ children }: PropsWithChildren) => (
	<div className="keyboard">{children}</div>
);

const Row = ({ children }: PropsWithChildren) => (
	<div className="row">{children}</div>
);

const Keyboard = (
	props: Omit<
		ComponentProps<typeof VirtualKeyboard>,
		'Keyboard' | 'Row' | 'Key' | 'blockNavigation' | 'layouts'
	>,
) => (
	<VirtualKeyboard
		{...props}
		id="keyboard"
		layouts={{
			base: {
				initialKey: 'one',
				keys: [
					[
						{ key: 'one', char: '1' },
						{ key: 'two', char: '2' },
						{ key: 'three', char: '3' },
					],
					[
						{
							key: 'backspace',
							label: 'Backspace',
							action: backspace,
						},
						{ key: 'done', label: 'Done', action: done },
						{ key: 'del', label: 'Del', action: del },
						{ key: 'left', label: 'Left', action: left },
						{ key: 'right', label: 'Right', action: right },
						{ key: 'home', label: 'Home', action: home },
						{ key: 'end', label: 'End', action: end },
					],
				],
			},
		}}
		Keyboard={KeyboardBody}
		Row={Row}
		Key={Interactable}
	/>
);

const Test = () => {
	const [value, setValue] = useState('');
	const onChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setValue(event.target.value);
		},
		[setValue],
	);

	return (
		<InputWithVirtualKeyboard
			id="input"
			onChange={onChange}
			value={value}
			VirtualKeyboard={Keyboard}
		/>
	);
};

const press = (key: Element | undefined | null) => {
	key?.dispatchEvent(ENTER.toKeyboardEvent('keydown'));
	jest.runAllTimers();
};

describe('InputWithVirtualKeyboard', () => {
	it('should render the input with virtual keyboard hidden', () => {
		const { container, unmount } = render(<Test />, {
			wrapper: Providers,
		});
		const wrapper = container.querySelector('.keyboard-wrapper');
		expect(wrapper).not.toBeNull();
		expect(wrapper?.innerHTML).toBe('');
		unmount();
	});

	it('should open the virtual keyboard on press', () => {
		const { container, unmount } = render(<Test />, {
			wrapper: Providers,
		});
		act(() => {
			const input = container.querySelector('#input');
			input?.dispatchEvent(ENTER.toKeyboardEvent('keydown'));
			jest.runAllTimers();
		});
		const wrapper = container.querySelector('.keyboard-wrapper');
		expect(wrapper?.querySelector('#keyboard-vk-one')).toBeTruthy();
		unmount();
	});

	it('should type into the input', () => {
		const { container, unmount } = render(<Test />, {
			wrapper: Providers,
		});
		act(() => {
			const input = container.querySelector('#input');
			input?.dispatchEvent(ENTER.toKeyboardEvent('keydown'));
			jest.runAllTimers();
		});

		act(() => {
			const wrapper = container.querySelector('.keyboard-wrapper');
			const oneKey = wrapper?.querySelector('#keyboard-vk-one');
			const twoKey = wrapper?.querySelector('#keyboard-vk-two');
			const threeKey = wrapper?.querySelector('#keyboard-vk-three');
			press(oneKey);
			press(twoKey);
			press(threeKey);
			press(threeKey);
			press(twoKey);
			press(oneKey);
		});
		expect(
			container.querySelector('#input-input')?.getAttribute('value'),
		).toBe('123321');

		const backspaceKey = container.querySelector('#keyboard-vk-backspace');
		const leftKey = container.querySelector('#keyboard-vk-left');
		const rightKey = container.querySelector('#keyboard-vk-right');
		const homeKey = container.querySelector('#keyboard-vk-home');
		const endKey = container.querySelector('#keyboard-vk-end');
		const delKey = container.querySelector('#keyboard-vk-del');
		const doneKey = container.querySelector('#keyboard-vk-done');

		act(() => {
			press(backspaceKey);
		});
		expect(
			container.querySelector('#input-input')?.getAttribute('value'),
		).toBe('12332');

		act(() => {
			press(leftKey);
			press(leftKey);
			press(leftKey);
			press(leftKey);
			press(delKey);
		});
		expect(
			container.querySelector('#input-input')?.getAttribute('value'),
		).toBe('1332');

		act(() => {
			press(endKey);
			press(backspaceKey);
		});
		expect(
			container.querySelector('#input-input')?.getAttribute('value'),
		).toBe('133');

		act(() => {
			press(homeKey);
			press(rightKey);
			press(backspaceKey);
		});
		expect(
			container.querySelector('#input-input')?.getAttribute('value'),
		).toBe('33');

		act(() => {
			press(doneKey);
		});
		expect(
			container.querySelector('#input-input')?.getAttribute('value'),
		).toBe('33');
		expect(container.querySelector('.keyboard-wrapper')?.innerHTML).toBe(
			'',
		);

		unmount();
	});
});
