import { type PropsWithChildren, createRef } from 'react';
import { act, render } from '@testing-library/react';
import { LEFT, RIGHT } from '@salik1992/tv-tools/control';
import type { FocusManager } from '@salik1992/tv-tools/focus';
import { FocusProvider } from './FocusProvider';
import { HorizontalFocus } from './HorizontalFocus';
import { Interactable } from './Interactable';
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
			<HorizontalFocus id="hf">
				<Interactable id="i1" onPress={onPress} />
				<Interactable id="i2" onPress={onPress} />
				<Interactable id="i3" onPress={onPress} />
				<Interactable id="i4" onPress={onPress} />
			</HorizontalFocus>,
			{ wrapper: Wrapper },
		);
		expect(container.innerHTML).toMatchSnapshot();
		unmount();
	});

	it('should move focus with LEFT/RIGHT keys', () => {
		const { container, rerender, unmount } = render(null, {
			wrapper: Wrapper,
		});

		assertFocusManager(focusManager);
		const focusSpy = jest.spyOn(focusManager.current, 'focus');

		rerender(
			<HorizontalFocus id="hf">
				<Interactable id="i1" onPress={onPress} focusOnMount />
				<Interactable id="i2" onPress={onPress} />
				<Interactable id="i3" onPress={onPress} />
			</HorizontalFocus>,
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
		const { container, rerender, unmount } = render(null, {
			wrapper: Wrapper,
		});

		assertFocusManager(focusManager);
		const focusSpy = jest.spyOn(focusManager.current, 'focus');

		rerender(
			<HorizontalFocus id="hf">
				<Interactable id="i1" onPress={onPress} focusOnMount />
				<Interactable id="i2" onPress={onPress} />
				<Interactable id="i3" onPress={onPress} />
			</HorizontalFocus>,
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
		const { container, rerender, unmount } = render(null, {
			wrapper: Wrapper,
		});

		assertFocusManager(focusManager);
		const focusSpy = jest.spyOn(focusManager.current, 'focus');

		rerender(
			<HorizontalFocus id="hf" ignoreRtl>
				<Interactable id="i1" onPress={onPress} focusOnMount />
				<Interactable id="i2" onPress={onPress} />
				<Interactable id="i3" onPress={onPress} />
			</HorizontalFocus>,
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
