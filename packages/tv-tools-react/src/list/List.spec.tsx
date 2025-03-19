import { act, render } from '@testing-library/react';
import { LEFT, RIGHT } from '@salik1992/tv-tools/control';
import { focus } from '@salik1992/tv-tools/focus';
import { BasicList } from '@salik1992/tv-tools/list/BasicList';
import { Performance } from '@salik1992/tv-tools/utils/Performance';
import { FocusRoot, Interactable } from '../focus';
import { List } from './List';

const focusSpy = jest.spyOn(focus, 'focus');
const throttleMs = 300;
jest.useFakeTimers();

describe('List', () => {
	beforeEach(() => {
		focusSpy.mockClear();
	});

	it('should render the list', () => {
		const { container, unmount } = render(
			<FocusRoot>
				<List
					id="list"
					Implementation={BasicList}
					throttleMs={throttleMs}
					configuration={{
						performance: Performance.BASIC,
						dataLength: 5,
						visibleElements: 5,
						config: {
							navigatableElements: 3,
							scrolling: {
								first: 50,
								other: 100,
							},
						},
					}}
					renderItem={({ id, dataIndex, onFocus, offset }) => (
						<Interactable
							id={id}
							key={id}
							data-data-index={dataIndex}
							data-offset={offset}
							onFocus={onFocus}
							onPress={jest.fn()}
						/>
					)}
					focusOnMount
				/>
			</FocusRoot>,
		);
		expect(container.innerHTML).toMatchSnapshot();
		expect(focusSpy).toHaveBeenCalledWith('list-0', {
			preventScroll: true,
		});
		unmount();
	});

	it('should move with keyboard, mouse wheel and virtual arrows', () => {
		const { container, unmount } = render(
			<FocusRoot>
				<List
					id="list"
					Implementation={BasicList}
					throttleMs={throttleMs}
					configuration={{
						performance: Performance.BASIC,
						dataLength: 10,
						visibleElements: 7,
						config: {
							navigatableElements: 5,
							scrolling: {
								first: 50,
								other: 100,
							},
						},
					}}
					renderItem={({ id, dataIndex, onFocus, offset }) => (
						<Interactable
							id={id}
							key={id}
							data-data-index={dataIndex}
							data-offset={offset}
							onFocus={onFocus}
							onPress={jest.fn()}
						/>
					)}
					focusOnMount
				/>
			</FocusRoot>,
		);

		// RIGHT
		act(() =>
			container
				.querySelector('#list-0')
				?.dispatchEvent(RIGHT.toKeyboardEvent('keydown')),
		);
		expect(focusSpy).toHaveBeenNthCalledWith(2, 'list-1', {
			preventScroll: true,
		});
		act(() => jest.advanceTimersByTime(throttleMs));

		// Wheel forward
		act(() =>
			container
				.querySelector('#list-1')
				?.dispatchEvent(
					new WheelEvent('wheel', { deltaY: 1, bubbles: true }),
				),
		);
		expect(focusSpy).toHaveBeenNthCalledWith(3, 'list-2', {
			preventScroll: true,
		});
		act(() => jest.advanceTimersByTime(throttleMs));

		// Next arrow
		act(() =>
			container
				.querySelector('.mouse-arrow.next')
				?.dispatchEvent(new MouseEvent('click', { bubbles: true })),
		);
		expect(focusSpy).toHaveBeenNthCalledWith(4, 'list-3', {
			preventScroll: true,
		});
		act(() => jest.advanceTimersByTime(throttleMs));

		// Previous arrow
		act(() =>
			container
				.querySelector('.mouse-arrow.previous')
				?.dispatchEvent(new MouseEvent('click', { bubbles: true })),
		);
		expect(focusSpy).toHaveBeenNthCalledWith(5, 'list-2', {
			preventScroll: true,
		});
		act(() => jest.advanceTimersByTime(throttleMs));

		// Wheel backward
		act(() =>
			container
				.querySelector('#list-2')
				?.dispatchEvent(
					new WheelEvent('wheel', { deltaY: -1, bubbles: true }),
				),
		);
		expect(focusSpy).toHaveBeenNthCalledWith(6, 'list-1', {
			preventScroll: true,
		});
		act(() => jest.advanceTimersByTime(throttleMs));

		// LEFT
		act(() =>
			container
				.querySelector('#list-1')
				?.dispatchEvent(LEFT.toKeyboardEvent('keydown')),
		);
		expect(focusSpy).toHaveBeenNthCalledWith(7, 'list-0', {
			preventScroll: true,
		});

		unmount();
	});
});
