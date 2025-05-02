import { act, render } from '@testing-library/react';
import { FocusProvider } from '../focus';
import { Input } from './Input';

jest.useFakeTimers();

describe('Input', () => {
	it('should render the Input with Interactable', () => {
		const { container, unmount } = render(
			<Input
				id="input-1"
				type="text"
				value={'test'}
				className="class-1"
				style={{ borderColor: 'black ' }}
				readOnly
			/>,
			{ wrapper: FocusProvider },
		);
		expect(container.innerHTML).toMatchSnapshot();
		unmount();
	});

	it('should render the Input without Interactable and input when disabled', () => {
		const { container, unmount } = render(
			<Input
				id="input-1"
				type="text"
				value={'test'}
				className="class-1"
				style={{ borderColor: 'black ' }}
				readOnly
				disabled
			/>,
			{ wrapper: FocusProvider },
		);
		expect(container.innerHTML).toMatchSnapshot();
		unmount();
	});

	it('should update render data and run proper callbacks when input', () => {
		const onChange = jest.fn();
		const { container, unmount } = render(
			<Input
				id="input-1"
				type="text"
				value={'test'}
				className="class-1"
				style={{ borderColor: 'black ' }}
				onChange={onChange}
			/>,
			{ wrapper: FocusProvider },
		);
		const input = container.querySelector('input');
		if (!input) {
			throw new Error('Input not found');
		}
		act(() => {
			input.value = 'test-changed';
			input.dispatchEvent(new InputEvent('change'));
			jest.runAllTimers();
		});
		expect(container.innerHTML).toMatchSnapshot();
		unmount();
	});
});
