import { type PropsWithChildren, createRef } from 'react';
import { act, render } from '@testing-library/react';
import { DOWN, LEFT, RIGHT, UP } from '@salik1992/tv-tools/control';
import type { FocusManager } from '@salik1992/tv-tools/focus';
import { BasicGrid } from '@salik1992/tv-tools/grid/BasicGrid';
import { Performance } from '@salik1992/tv-tools/utils/Performance';
import { FocusProvider, Interactable } from '../focus';
import { ExposeFocusManager, assertFocusManager } from '../focus/mocks';
import { Grid } from './Grid';

const throttleMs = 300;
jest.useFakeTimers();

const focusManager = createRef<FocusManager>();
const Wrapper = ({ children }: PropsWithChildren) => (
	<FocusProvider id="focusRoot">
		{children}
		<ExposeFocusManager focusManager={focusManager} />
	</FocusProvider>
);

describe('Grid', () => {
	it('should render the grid', () => {
		const { container, rerender, unmount } = render(null, {
			wrapper: Wrapper,
		});
		assertFocusManager(focusManager);
		const focusSpy = jest.spyOn(focusManager.current, 'focus');
		rerender(
			<Grid
				id="grid"
				Implementation={BasicGrid}
				throttleMs={throttleMs}
				configuration={{
					performance: Performance.BASIC,
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
				data={Array.from({ length: 25 }, (_, i) => i.toString())}
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
			/>,
		);
		expect(container.innerHTML).toMatchSnapshot();
		expect(focusSpy).toHaveBeenCalledWith('grid-g0-e0', {
			preventScroll: true,
		});
		unmount();
	});

	it('should move with keyboard, mouse wheel and virtual arrows', () => {
		const { container, unmount } = render(
			<Grid
				id="grid"
				Implementation={BasicGrid}
				throttleMs={throttleMs}
				configuration={{
					performance: Performance.BASIC,
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
				data={Array.from({ length: 25 }, (_, i) => i.toString())}
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
			/>,
			{ wrapper: Wrapper },
		);

		assertFocusManager(focusManager);
		const focusSpy = jest.spyOn(focusManager.current, 'focus');

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
