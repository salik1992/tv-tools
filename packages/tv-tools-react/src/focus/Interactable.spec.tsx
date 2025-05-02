import type { PropsWithChildren } from 'react';
import { createRef } from 'react';
import { render } from '@testing-library/react';
import { ENTER } from '@salik1992/tv-tools/control';
import type { FocusManager } from '@salik1992/tv-tools/focus';
import { FocusProvider } from './FocusProvider';
import { Interactable } from './Interactable';
import { ExposeFocusManager, assertFocusManager } from './mocks';

const onPress = jest.fn(() => true);
const focusManager = createRef<FocusManager>();

const Wrapper = ({ children }: PropsWithChildren) => (
	<FocusProvider>
		{children}
		<ExposeFocusManager focusManager={focusManager} />
	</FocusProvider>
);

describe('Interactable', () => {
	it('should render the children', () => {
		const { container, rerender, unmount } = render(
			<Interactable id="i1" onPress={onPress}>
				Hello World
			</Interactable>,
			{ wrapper: Wrapper },
		);
		expect(container.innerHTML).toMatchSnapshot();
		assertFocusManager(focusManager);
		const focusSpy = jest.spyOn(focusManager.current, 'focus');
		rerender(
			<Interactable id="i1" onPress={onPress}>
				Hello World
			</Interactable>,
		);
		expect(focusSpy).not.toHaveBeenCalled();
		unmount();
	});

	it('should focus itself with focusOnMount', () => {
		const { unmount, rerender } = render(
			<Interactable id="i1" onPress={onPress} />,
			{ wrapper: Wrapper },
		);
		assertFocusManager(focusManager);
		const focusSpy = jest.spyOn(focusManager.current, 'focus');
		rerender(<Interactable id="i1" onPress={onPress} focusOnMount />);
		expect(focusSpy).toHaveBeenCalledWith('i1', {
			preventScroll: true,
		});
		unmount();
	});

	it('should focus itself on mouse over', () => {
		const { container, unmount } = render(
			<Interactable id="i1" onPress={onPress} />,
			{ wrapper: Wrapper },
		);
		assertFocusManager(focusManager);
		const focusSpy = jest.spyOn(focusManager.current, 'focus');
		const event = new MouseEvent('mouseover', {
			bubbles: true,
		});
		container.querySelector('#i1')?.dispatchEvent(event);
		expect(focusSpy).toHaveBeenCalledWith('i1', {
			preventScroll: true,
		});
		unmount();
	});

	it('should call onPress on ENTER key', () => {
		const { container, unmount } = render(
			<Interactable id="i1" onPress={onPress} />,
			{ wrapper: Wrapper },
		);
		assertFocusManager(focusManager);
		const event = ENTER.toKeyboardEvent('keydown');
		const spyStopPropagation = jest.spyOn(event, 'stopPropagation');
		const spyPreventDefault = jest.spyOn(event, 'preventDefault');
		container.querySelector('#i1')?.dispatchEvent(event);
		expect(onPress).toHaveBeenCalled();
		expect(spyStopPropagation).toHaveBeenCalled();
		expect(spyPreventDefault).toHaveBeenCalled();
		unmount();
	});

	it('should call onPress on click', () => {
		const { container, unmount } = render(
			<Interactable id="i1" onPress={onPress} />,
			{ wrapper: Wrapper },
		);
		const event = new MouseEvent('click', {
			bubbles: true,
		});
		container.querySelector('#i1')?.dispatchEvent(event);
		expect(onPress).toHaveBeenCalled();
		unmount();
	});

	it('should not be focusable when disabled', () => {
		const { unmount } = render(
			<Interactable id="i1" onPress={onPress} disabled />,
			{ wrapper: Wrapper },
		);
		assertFocusManager(focusManager);
		expect(focusManager.current.hasFocusId('i1')).toBe(false);
		unmount();
	});

	it('should remove itself from focus when disabled', () => {
		const { unmount, rerender } = render(
			<Interactable id="i1" onPress={onPress} />,
			{ wrapper: Wrapper },
		);
		assertFocusManager(focusManager);
		expect(focusManager.current.hasFocusId('i1')).toBe(true);
		rerender(<Interactable id="i1" onPress={onPress} disabled />);
		expect(focusManager.current.hasFocusId('i1')).toBe(false);
		unmount();
	});

	it('should remove itself from focus when unmounted', () => {
		const { unmount } = render(<Interactable id="i1" onPress={onPress} />, {
			wrapper: Wrapper,
		});
		assertFocusManager(focusManager);
		expect(focusManager.current.hasFocusId('i1')).toBe(true);
		unmount();
		expect(focusManager.current.hasFocusId('i1')).toBe(false);
	});
});
