import { render, act } from '@testing-library/react';
import { UP, DOWN } from '@salik1992/tv-tools/control';
import { focus } from '@salik1992/tv-tools/focus';
import { FocusRoot } from './FocusRoot';
import { Interactable } from './Interactable';
import { VerticalFocus } from './VerticalFocus';

const onPress = jest.fn();
const focusSpy = jest.spyOn(focus, 'focus');

describe('HorizontalFocus', () => {
	beforeEach(() => {
		focusSpy.mockClear();
	});

	it('should render the children', () => {
		const { container, unmount } = render(
			<FocusRoot>
				<VerticalFocus id="hf">
					<Interactable id="i1" onPress={onPress} />
					<Interactable id="i2" onPress={onPress} />
					<Interactable id="i3" onPress={onPress} />
					<Interactable id="i4" onPress={onPress} />
				</VerticalFocus>
			</FocusRoot>,
		);
		expect(container.innerHTML).toMatchSnapshot();
		unmount();
	});

	it('should move focus with UP/DOWN keys', () => {
		const { container, unmount } = render(
			<FocusRoot>
				<VerticalFocus id="hf">
					<Interactable id="i1" onPress={onPress} focusOnMount />
					<Interactable id="i2" onPress={onPress} />
					<Interactable id="i3" onPress={onPress} />
				</VerticalFocus>
			</FocusRoot>,
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
