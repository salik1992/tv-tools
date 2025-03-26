import { act, render } from '@testing-library/react';
import { DOWN, LEFT, RIGHT, UP } from '@salik1992/tv-tools/control';
import { focus } from '@salik1992/tv-tools/focus';
import { BasicGrid } from '@salik1992/tv-tools/grid/BasicGrid';
import { Performance } from '@salik1992/tv-tools/utils/Performance';
import { FocusRoot, Interactable } from '../focus';
import { Grid } from './Grid';

const focusSpy = jest.spyOn(focus, 'focus');
const throttleMs = 300;
jest.useFakeTimers();

describe('Grid', () => {
	beforeEach(() => {
		focusSpy.mockClear();
	});

	it('should render the grid', () => {
		const { container, unmount } = render(
			<FocusRoot>
				<Grid
					id="grid"
					Implementation={BasicGrid}
					throttleMs={throttleMs}
					configuration={{
						performance: Performance.BASIC,
						dataLength: 25,
						visibleGroups: 5,
						elementsPerGroup: 5,
						config: {
							navigatableGroups: 3,
							scrolling: {
								first: 50,
								other: 100,
							},
						},
					}}
					renderGroup={({ id, offset, elements }) => (
						<div
							className="group"
							id={id}
							key={id}
							data-data-offset={offset}
						>
							{elements.map(({ id, dataIndex, onFocus }) => (
								<Interactable
									id={id}
									key={id}
									data-data-index={dataIndex}
									onFocus={onFocus}
									onPress={jest.fn()}
								/>
							))}
						</div>
					)}
					focusOnMount
				/>
			</FocusRoot>,
		);
		expect(container.innerHTML).toMatchSnapshot();
		expect(focusSpy).toHaveBeenCalledWith('grid-g0-e0', {
			preventScroll: true,
		});
		unmount();
	});

	it('should move with keyboard, mouse wheel and virtual arrows', () => {
		const { container, unmount } = render(
			<FocusRoot>
				<Grid
					id="grid"
					Implementation={BasicGrid}
					throttleMs={throttleMs}
					configuration={{
						performance: Performance.BASIC,
						dataLength: 25,
						visibleGroups: 5,
						elementsPerGroup: 5,
						config: {
							navigatableGroups: 3,
							scrolling: {
								first: 50,
								other: 100,
							},
						},
					}}
					renderGroup={({ id, offset, elements }) => (
						<div
							className="group"
							id={id}
							key={id}
							data-data-offset={offset}
						>
							{elements.map(({ id, dataIndex, onFocus }) => (
								<Interactable
									id={id}
									key={id}
									data-data-index={dataIndex}
									onFocus={onFocus}
									onPress={jest.fn()}
								/>
							))}
						</div>
					)}
					focusOnMount
				/>
			</FocusRoot>,
		);

		// RIGHT
		act(() => {
			container
				.querySelector('#grid-g0-e0')
				?.dispatchEvent(RIGHT.toKeyboardEvent('keydown'));
		});
		expect(focusSpy).toHaveBeenCalledWith('grid-g0-e1', {
			preventScroll: true,
		});
		act(() => jest.advanceTimersByTime(throttleMs));

		// DOWN
		act(() => {
			container
				.querySelector('#grid-g0-e1')
				?.dispatchEvent(DOWN.toKeyboardEvent('keydown'));
		});
		expect(focusSpy).toHaveBeenCalledWith('grid-g1-e1', {
			preventScroll: true,
		});
		act(() => jest.advanceTimersByTime(throttleMs));

		// Wheel forward
		act(() =>
			container
				.querySelector('#grid-g1-e1')
				?.dispatchEvent(
					new WheelEvent('wheel', { deltaY: 1, bubbles: true }),
				),
		);
		expect(focusSpy).toHaveBeenCalledWith('grid-g2-e1', {
			preventScroll: true,
		});
		act(() => jest.advanceTimersByTime(throttleMs));

		// Next arrow
		act(() =>
			container
				.querySelector('.mouse-arrow.next')
				?.dispatchEvent(new MouseEvent('click', { bubbles: true })),
		);
		expect(focusSpy).toHaveBeenCalledWith('grid-g2-e1', {
			preventScroll: true,
		});
		act(() => jest.advanceTimersByTime(throttleMs));

		// Previous arrow
		act(() =>
			container
				.querySelector('.mouse-arrow.previous')
				?.dispatchEvent(new MouseEvent('click', { bubbles: true })),
		);
		expect(focusSpy).toHaveBeenCalledWith('grid-g1-e1', {
			preventScroll: true,
		});
		act(() => jest.advanceTimersByTime(throttleMs));

		// Wheel backward
		act(() =>
			container
				.querySelector('#grid-g1-e1')
				?.dispatchEvent(
					new WheelEvent('wheel', { deltaY: -1, bubbles: true }),
				),
		);
		expect(focusSpy).toHaveBeenCalledWith('grid-g1-e1', {
			preventScroll: true,
		});
		act(() => jest.advanceTimersByTime(throttleMs));

		// UP
		act(() => {
			container
				.querySelector('#grid-g1-e1')
				?.dispatchEvent(UP.toKeyboardEvent('keydown'));
		});
		expect(focusSpy).toHaveBeenCalledWith('grid-g0-e1', {
			preventScroll: true,
		});
		act(() => jest.advanceTimersByTime(throttleMs));

		// LEFT
		act(() => {
			container
				.querySelector('#grid-g0-e1')
				?.dispatchEvent(LEFT.toKeyboardEvent('keydown'));
		});
		expect(focusSpy).toHaveBeenCalledWith('grid-g0-e0', {
			preventScroll: true,
		});
		act(() => jest.advanceTimersByTime(throttleMs));

		unmount();
	});
});
