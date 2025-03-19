import { act, render } from '@testing-library/react';
import { LEFT, RIGHT } from '@salik1992/tv-tools/control';
import { focus } from '@salik1992/tv-tools/focus';
import { FocusRoot } from './FocusRoot';
import { HorizontalFocus } from './HorizontalFocus';
import { Interactable } from './Interactable';

const onPress = jest.fn();
const focusSpy = jest.spyOn(focus, 'focus');

describe('HorizontalFocus', () => {
	beforeEach(() => {
		focusSpy.mockClear();
	});

	it('should render the children', () => {
		const { container, unmount } = render(
			<FocusRoot>
				<HorizontalFocus id="hf">
					<Interactable id="i1" onPress={onPress} />
					<Interactable id="i2" onPress={onPress} />
					<Interactable id="i3" onPress={onPress} />
					<Interactable id="i4" onPress={onPress} />
				</HorizontalFocus>
			</FocusRoot>,
		);
		expect(container.innerHTML).toMatchSnapshot();
		unmount();
	});

	it('should move focus with LEFT/RIGHT keys', () => {
		const { container, unmount } = render(
			<FocusRoot>
				<HorizontalFocus id="hf">
					<Interactable id="i1" onPress={onPress} focusOnMount />
					<Interactable id="i2" onPress={onPress} />
					<Interactable id="i3" onPress={onPress} />
				</HorizontalFocus>
			</FocusRoot>,
		);
		expect(focusSpy).toHaveBeenNthCalledWith(1, 'i1', {
			preventScroll: true,
		});

		// RIGHT
		let event = RIGHT.toKeyboardEvent('keydown');
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

		// RIGHT
		event = RIGHT.toKeyboardEvent('keydown');
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

		// RIGHT
		event = RIGHT.toKeyboardEvent('keydown');
		spyStopPropagation = jest.spyOn(event, 'stopPropagation');
		spyPreventDefault = jest.spyOn(event, 'preventDefault');
		act(() => {
			container.querySelector('#i3')?.dispatchEvent(event);
		});
		expect(focusSpy).toHaveBeenCalledTimes(3);
		expect(spyStopPropagation).not.toHaveBeenCalled();
		expect(spyPreventDefault).not.toHaveBeenCalled();

		// LEFT
		event = LEFT.toKeyboardEvent('keydown');
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

		// LEFT
		event = LEFT.toKeyboardEvent('keydown');
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

		// LEFT
		event = LEFT.toKeyboardEvent('keydown');
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

	it('should swap LEFT/RIGHT keys with rtl', () => {
		document.documentElement.dir = 'rtl';
		const { container, unmount } = render(
			<FocusRoot>
				<HorizontalFocus id="hf">
					<Interactable id="i1" onPress={onPress} focusOnMount />
					<Interactable id="i2" onPress={onPress} />
					<Interactable id="i3" onPress={onPress} />
				</HorizontalFocus>
			</FocusRoot>,
		);

		let event = RIGHT.toKeyboardEvent('keydown');
		let spyStopPropagation = jest.spyOn(event, 'stopPropagation');
		let spyPreventDefault = jest.spyOn(event, 'preventDefault');
		act(() => {
			container.querySelector('#i1')?.dispatchEvent(event);
		});
		expect(focusSpy).toHaveBeenCalledTimes(1); // focusOnMount
		expect(spyStopPropagation).not.toHaveBeenCalled();
		expect(spyPreventDefault).not.toHaveBeenCalled();

		event = LEFT.toKeyboardEvent('keydown');
		spyStopPropagation = jest.spyOn(event, 'stopPropagation');
		spyPreventDefault = jest.spyOn(event, 'preventDefault');
		act(() => {
			container.querySelector('#i1')?.dispatchEvent(event);
		});
		expect(focusSpy).toHaveBeenNthCalledWith(2, 'i2', {
			preventScroll: true,
		});
		expect(spyStopPropagation).toHaveBeenCalled();
		expect(spyPreventDefault).toHaveBeenCalled();

		event = RIGHT.toKeyboardEvent('keydown');
		spyStopPropagation = jest.spyOn(event, 'stopPropagation');
		spyPreventDefault = jest.spyOn(event, 'preventDefault');
		act(() => {
			container.querySelector('#i2')?.dispatchEvent(event);
		});
		expect(focusSpy).toHaveBeenNthCalledWith(3, 'i1', {
			preventScroll: true,
		});
		expect(spyStopPropagation).toHaveBeenCalled();
		expect(spyPreventDefault).toHaveBeenCalled();

		unmount();
		document.documentElement.dir = '';
	});

	it('should not swap LEFT/RIGHT keys with ignoreRtl', () => {
		document.documentElement.dir = 'rtl';
		const { container, unmount } = render(
			<FocusRoot>
				<HorizontalFocus id="hf" ignoreRtl>
					<Interactable id="i1" onPress={onPress} focusOnMount />
					<Interactable id="i2" onPress={onPress} />
					<Interactable id="i3" onPress={onPress} />
				</HorizontalFocus>
			</FocusRoot>,
		);

		let event = RIGHT.toKeyboardEvent('keydown');
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

		event = LEFT.toKeyboardEvent('keydown');
		spyStopPropagation = jest.spyOn(event, 'stopPropagation');
		spyPreventDefault = jest.spyOn(event, 'preventDefault');
		act(() => {
			container.querySelector('#i2')?.dispatchEvent(event);
		});
		expect(focusSpy).toHaveBeenNthCalledWith(3, 'i1', {
			preventScroll: true,
		});
		expect(spyStopPropagation).toHaveBeenCalled();
		expect(spyPreventDefault).toHaveBeenCalled();

		unmount();
		document.documentElement.dir = '';
	});
});
