import { type PropsWithChildren, createRef } from 'react';
import { act, render } from '@testing-library/react';
import { DOWN, UP } from '@salik1992/tv-tools/control';
import type { FocusManager } from '@salik1992/tv-tools/focus';
import { FocusProvider } from './FocusProvider';
import { Interactable } from './Interactable';
import { VerticalFocus } from './VerticalFocus';
import { ExposeFocusManager, assertFocusManager } from './mocks';

const onPress = jest.fn();
const focusManager = createRef<FocusManager>();
const Wrapper = ({ children }: PropsWithChildren) => (
	<FocusProvider id="focusRoot">
		{children}
		<ExposeFocusManager focusManager={focusManager} />
	</FocusProvider>
);

describe('HorizontalFocus', () => {
	it('should render the children', () => {
		const { container, unmount } = render(
			<VerticalFocus id="hf">
				<Interactable id="i1" onPress={onPress} />
				<Interactable id="i2" onPress={onPress} />
				<Interactable id="i3" onPress={onPress} />
				<Interactable id="i4" onPress={onPress} />
			</VerticalFocus>,
			{ wrapper: Wrapper },
		);
		expect(container.innerHTML).toMatchSnapshot();
		unmount();
	});

	it('should move focus with UP/DOWN keys', () => {
		const { container, rerender, unmount } = render(null, {
			wrapper: Wrapper,
		});

		assertFocusManager(focusManager);
		const focusSpy = jest.spyOn(focusManager.current, 'focus');

		rerender(
			<VerticalFocus id="hf">
				<Interactable id="i1" onPress={onPress} focusOnMount />
				<Interactable id="i2" onPress={onPress} />
				<Interactable id="i3" onPress={onPress} />
			</VerticalFocus>,
		);

		expect(focusSpy).toHaveBeenNthCalledWith(1, 'i1', {
			preventScroll: true,
		});

		// DOWN
		let event = DOWN.toKeyboardEvent('keydown');
		let spyStopPropagation = jest.spyOn(event, 'stopPropagation');
		let spyPreventDefault = jest.spyOn(event, 'preventDefault');
		act(() => {
			container.querySelector('#i1')?.dispatchEvent(event);
		});
		expect(focusSpy).toHaveBeenNthCalledWith(2, 'i2', {
			preventScroll: true,
		});
		expect(spyStopPropagation).toHaveBeenCalled();
		expect(spyPreventDefault).toHaveBeenCalled();

		// DOWN
		event = DOWN.toKeyboardEvent('keydown');
		spyStopPropagation = jest.spyOn(event, 'stopPropagation');
		spyPreventDefault = jest.spyOn(event, 'preventDefault');
		act(() => {
			container.querySelector('#i2')?.dispatchEvent(event);
		});
		expect(focusSpy).toHaveBeenNthCalledWith(3, 'i3', {
			preventScroll: true,
		});
		expect(spyStopPropagation).toHaveBeenCalled();
		expect(spyPreventDefault).toHaveBeenCalled();

		// DOWN
		event = DOWN.toKeyboardEvent('keydown');
		spyStopPropagation = jest.spyOn(event, 'stopPropagation');
		spyPreventDefault = jest.spyOn(event, 'preventDefault');
		act(() => {
			container.querySelector('#i3')?.dispatchEvent(event);
		});
		expect(focusSpy).toHaveBeenCalledTimes(3);
		expect(spyStopPropagation).not.toHaveBeenCalled();
		expect(spyPreventDefault).not.toHaveBeenCalled();

		// UP
		event = UP.toKeyboardEvent('keydown');
		spyStopPropagation = jest.spyOn(event, 'stopPropagation');
		spyPreventDefault = jest.spyOn(event, 'preventDefault');
		act(() => {
			container.querySelector('#i3')?.dispatchEvent(event);
		});
		expect(focusSpy).toHaveBeenNthCalledWith(4, 'i2', {
			preventScroll: true,
		});
		expect(spyStopPropagation).toHaveBeenCalled();
		expect(spyPreventDefault).toHaveBeenCalled();

		// UP
		event = UP.toKeyboardEvent('keydown');
		spyStopPropagation = jest.spyOn(event, 'stopPropagation');
		spyPreventDefault = jest.spyOn(event, 'preventDefault');
		act(() => {
			container.querySelector('#i2')?.dispatchEvent(event);
		});
		expect(focusSpy).toHaveBeenNthCalledWith(5, 'i1', {
			preventScroll: true,
		});
		expect(spyStopPropagation).toHaveBeenCalled();
		expect(spyPreventDefault).toHaveBeenCalled();

		// UP
		event = UP.toKeyboardEvent('keydown');
		spyStopPropagation = jest.spyOn(event, 'stopPropagation');
		spyPreventDefault = jest.spyOn(event, 'preventDefault');
		act(() => {
			container.querySelector('#i1')?.dispatchEvent(event);
		});
		expect(focusSpy).toHaveBeenCalledTimes(5);
		expect(spyStopPropagation).not.toHaveBeenCalled();
		expect(spyPreventDefault).not.toHaveBeenCalled();

		unmount();
	});
});
