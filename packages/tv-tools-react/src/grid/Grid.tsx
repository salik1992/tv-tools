import {
	type MouseEvent,
	type ReactNode,
	type WheelEvent,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import type { ControlEvent } from '@salik1992/tv-tools/focus';
import type {
	GridImplementation,
	GridSetup,
	RenderData,
	RenderDataGroup,
} from '@salik1992/tv-tools/grid';
import { FocusContext, useFocusContainer } from '../focus';
import { useThrottledCallback } from '../utils/useThrottledCallback';

const isFirstGroup = (index: number, elementsPerGroup: number) =>
	Math.floor(index / elementsPerGroup) <= 0;

const isLastGroup = (
	index: number,
	elementsPerGroup: number,
	dataLength: number,
) =>
	Math.floor(index / elementsPerGroup) >=
	Math.floor((dataLength - 1) / elementsPerGroup);

/**
 * Grid component.
 */
export const Grid = <Configuration extends Record<string, unknown>>({
	id,
	Implementation,
	configuration,
	renderGroup,
	orientation = 'vertical',
	focusOnMount = false,
	throttleMs = 300,
	ignoreRtl,
	onDataIndex: outerOnDataIndex,
	scrollToTopWithBack = false,
	moveByOneInBetweenGroups = false,
}: {
	/* The optional ID to use for focus and the grid. */
	id?: string;
	/* The behavior of the grid. */
	Implementation: GridImplementation<GridSetup<Configuration>>;
	/* The configuration of the grid. */
	configuration: Omit<GridSetup<Configuration>, 'id'>;
	/* The function that renders each element. */
	renderGroup: (element: RenderDataGroup) => ReactNode;
	/* Orientation of the grid that will change control keys. Default: vertical */
	orientation?: 'vertical' | 'horizontal';
	/* Whether the horizontal grid should render ltr even in rtl. */
	ignoreRtl?: boolean;
	/* Whether the grid should auto focus when mounted. */
	focusOnMount?: boolean;
	/* The time used for throttling the movement. */
	throttleMs?: number;
	/* The listener for changes in data index. */
	onDataIndex?: (index: number) => void;
	/* Whether the grid should scroll to top when pressing BACK. */
	scrollToTopWithBack?: boolean;
	/* Whether when moving by one element, the focus should move to the next/previous group. */
	moveByOneInBetweenGroups?: boolean;
}) => {
	const {
		container,
		focusContextValue,
		useOnUp,
		useOnDown,
		useOnLeft,
		useOnRight,
		useOnBack,
	} = useFocusContainer(id);
	const [dataIndex, setDataIndex] = useState(0);

	// Grid instance
	const grid = useMemo(
		() =>
			new Implementation(container, {
				id: container.id,
				...configuration,
			}),
		[Implementation, container],
	);

	// Render data from the grid
	const [renderData, setRenderData] = useState(grid.getRenderData());

	// Focusing on mount
	useEffect(() => {
		if (focusOnMount) {
			container.focus({ preventScroll: true });
		}
	}, [focusOnMount]);

	const onRenderData = useCallback(
		(newRenderData: RenderData) => {
			setRenderData(newRenderData);
		},
		[setRenderData],
	);

	const onDataIndex = useCallback(
		(index: number) => {
			setDataIndex(index);
			outerOnDataIndex?.(index);
		},
		[outerOnDataIndex, dataIndex],
	);

	// Backwards movement from keys
	const backward = useThrottledCallback(
		(e?: ControlEvent) => {
			return moveByOneInBetweenGroups ||
				dataIndex % configuration.elementsPerGroup !== 0
				? grid.moveBy(-1, (e?.target as HTMLElement | undefined)?.id)
				: false;
		},
		[grid, renderData, dataIndex],
		{ throttledReturn: true, limitMs: throttleMs },
	);
	const backwardJump = useThrottledCallback(
		(e?: ControlEvent) => {
			return !isFirstGroup(dataIndex, configuration.elementsPerGroup)
				? grid.moveBy(
						-configuration.elementsPerGroup,
						(e?.target as HTMLElement | undefined)?.id,
					)
				: false;
		},
		[grid, renderData, dataIndex],
		{ throttledReturn: true, limitMs: throttleMs },
	);

	// Forwards movement from keys
	const forward = useThrottledCallback(
		(e?: ControlEvent) => {
			return moveByOneInBetweenGroups ||
				dataIndex % configuration.elementsPerGroup !==
					configuration.elementsPerGroup - 1
				? grid.moveBy(1, (e?.target as HTMLElement | undefined)?.id)
				: false;
		},
		[grid, renderData, dataIndex],
		{ throttledReturn: true, limitMs: throttleMs },
	);
	const forwardJump = useThrottledCallback(
		(e?: ControlEvent) => {
			return !isLastGroup(
				dataIndex,
				configuration.elementsPerGroup,
				configuration.dataLength,
			)
				? grid.moveBy(
						configuration.elementsPerGroup,
						(e?.target as HTMLElement | undefined)?.id,
					)
				: false;
		},
		[grid, renderData, dataIndex],
		{ throttledReturn: true, limitMs: throttleMs },
	);

	// Attaching movement functions to key listeners
	if (orientation === 'horizontal') {
		useOnLeft(backwardJump, [backwardJump], { ignoreRtl });
		useOnRight(forwardJump, [forwardJump], { ignoreRtl });
		useOnUp(backward);
		useOnDown(forward);
	} else {
		useOnUp(backwardJump);
		useOnDown(forwardJump);
		useOnLeft(backward, [backward], { ignoreRtl });
		useOnRight(forward, [forward], { ignoreRtl });
	}

	useOnBack(() => {
		if (
			scrollToTopWithBack &&
			!isFirstGroup(dataIndex, configuration.elementsPerGroup)
		) {
			grid.moveTo(0);
			return true;
		}
		return false;
	}, [grid, scrollToTopWithBack, dataIndex]);

	// Scrolling the wheel with pointer wheel.
	const onWheel = useThrottledCallback(
		(e: WheelEvent<HTMLElement>) => {
			const delta = e.deltaX || e.deltaY;
			let processed = false;
			if (delta < 0) {
				processed = grid.moveBy(-configuration.elementsPerGroup);
			} else if (delta > 0) {
				processed = grid.moveBy(configuration.elementsPerGroup);
			}
			if (processed) {
				e.stopPropagation();
			}
		},
		[grid, renderData],
		{ throttledReturn: undefined, limitMs: throttleMs },
	);

	const onMousePrevious = useCallback(
		(e: MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			backwardJump();
		},
		[backward],
	);

	const onMouseNext = useCallback(
		(e: MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			forwardJump();
		},
		[forward],
	);

	useEffect(() => {
		grid.addEventListener('renderData', onRenderData);
		return () => grid.removeEventListener('renderData', onRenderData);
	}, [grid, onRenderData]);

	useEffect(() => {
		if (typeof onDataIndex === 'function') {
			grid.addEventListener('dataIndex', onDataIndex);
			return () => grid.removeEventListener('dataIndex', onDataIndex);
		}
	}, [grid, onDataIndex]);

	return (
		<FocusContext.Provider value={focusContextValue}>
			<div className="grid" onWheel={onWheel}>
				<div
					className="grid-inner-wrap"
					style={{
						transform: `translate${orientation === 'horizontal' ? 'X' : 'Y'}(-${renderData.gridOffset}px)`,
					}}
				>
					{renderData.groups.map(renderGroup)}
				</div>
				{renderData.previousArrow &&
					!isFirstGroup(
						dataIndex,
						configuration.elementsPerGroup,
					) && (
						<div
							className="mouse-arrow previous"
							onClick={onMousePrevious}
						/>
					)}
				{renderData.nextArrow &&
					!isLastGroup(
						dataIndex,
						configuration.elementsPerGroup,
						configuration.dataLength,
					) && (
						<div
							className="mouse-arrow next"
							onClick={onMouseNext}
						/>
					)}
			</div>
		</FocusContext.Provider>
	);
};
