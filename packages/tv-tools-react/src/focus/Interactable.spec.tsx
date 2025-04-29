import { render } from '@testing-library/react';
import { ENTER } from '@salik1992/tv-tools/control';
import { focus } from '@salik1992/tv-tools/focus';
import { FocusRoot } from './FocusRoot';
import { Interactable } from './Interactable';

const onPress = jest.fn(() => true);
const focusSpy = jest.spyOn(focus, 'focus');

describe('Interactable', () => {
	beforeEach(() => {
		focusSpy.mockClear();
	});

	it('should render the children', () => {
		const { container, unmount } = render(
			<Interactable id="i1" onPress={onPress}>
				Hello World
			</Interactable>,
		);
		expect(container.innerHTML).toMatchSnapshot();
		expect(focusSpy).not.toHaveBeenCalled();
		unmount();
	});

	it('should focus itself with focusOnMount', () => {
		const { unmount } = render(
			<Interactable id="i1" onPress={onPress} focusOnMount />,
		);
		expect(focusSpy).toHaveBeenCalledWith('i1', {
			preventScroll: true,
		});
		unmount();
	});

	it('should focus itself on mouse over', () => {
		const { container, unmount } = render(
			<Interactable id="i1" onPress={onPress} />,
		);
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
			<FocusRoot>
				<Interactable id="i1" onPress={onPress} />
			</FocusRoot>,
		);
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
		);
		expect(focus.hasFocusId('i1')).toBe(false);
		unmount();
	});

	it('should remove itself from focus when disabled', () => {
		const { unmount, rerender } = render(
			<Interactable id="i1" onPress={onPress} />,
		);
		expect(focus.hasFocusId('i1')).toBe(true);
		rerender(<Interactable id="i1" onPress={onPress} disabled />);
		expect(focus.hasFocusId('i1')).toBe(false);
		unmount();
	});

	it('should remove itself from focus when unmounted', () => {
		const { unmount } = render(<Interactable id="i1" onPress={onPress} />);
		expect(focus.hasFocusId('i1')).toBe(true);
		unmount();
		expect(focus.hasFocusId('i1')).toBe(false);
	});
});
