import {
	type WheelEvent,
	type ReactNode,
	useMemo,
	useState,
	useEffect,
	useCallback,
} from 'react';
import type { ControlEvent } from '@salik1992/tv-tools/focus';
import type {
	ListImplementation,
	RenderData,
	RenderDataElement,
} from '@salik1992/tv-tools/list';
import { FocusContext, useFocusContainer } from '../focus';
import { useThrottledCallback } from '../utils/useThrottledCallback';

/**
 * List component.
 */
export const List = <
	Implementation extends ListImplementation,
	Configuration extends
		ConstructorParameters<Implementation>[1] = ConstructorParameters<Implementation>[1],
>({
	id,
	Implementation,
	configuration,
	renderItem,
	orientation = 'horizontal',
	focusOnMount = false,
	throttleMs = 300,
	ignoreRtl,
	onDataIndex,
}: {
	/* The optional ID to use for focus and the list. */
	id?: string;
	/* The behavior of the list. */
	Implementation: Implementation;
	/* The configuration of the list. */
	configuration: Omit<Configuration, 'id'>;
	/* The function that renders each element. */
	renderItem: (element: RenderDataElement) => ReactNode;
	/* Orientation of the list that will change control keys. */
	orientation?: 'vertical' | 'horizontal';
	/* Whether the horizontal list should render ltr even in rtl. */
	ignoreRtl?: boolean;
	/* Whether the list should auto focus when mounted. */
	focusOnMount?: boolean;
	/* The time used for throttling the movement. */
	throttleMs?: number;
	/* The listener for changes in data index. */
	onDataIndex?: (index: number) => void;
}) => {
	const {
		container,
		focusContextValue,
		useOnUp,
		useOnDown,
		useOnLeft,
		useOnRight,
	} = useFocusContainer(id);

	// List instance
	const list = useMemo(
		() =>
			new Implementation(container, {
				id: container.id,
				...configuration,
			}),
		[Implementation, configuration, container],
	);

	// Render data from the list
	const [renderData, setRenderData] = useState(list.getRenderData());

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

	// Backwards movement from keys
	const backward = useThrottledCallback(
		(e: ControlEvent) => {
			return list.moveBy(-1, (e.target as HTMLElement).id);
		},
		[list, renderData],
		{ throttledReturn: true, limitMs: throttleMs },
	);

	// Forwards movement from keys
	const forward = useThrottledCallback(
		(e: ControlEvent) => {
			return list.moveBy(1, (e.target as HTMLElement).id);
		},
		[list, renderData],
		{ throttledReturn: true, limitMs: throttleMs },
	);

	// Attaching movement functions to key listeners
	if (orientation === 'horizontal') {
		useOnLeft(backward, [backward], { ignoreRtl });
		useOnRight(forward, [forward], { ignoreRtl });
	} else {
		useOnUp(backward);
		useOnDown(forward);
	}

	// Scrolling the wheel with pointer wheel.
	const onWheel = useThrottledCallback(
		(e: WheelEvent<HTMLElement>) => {
			const delta = e.deltaX || e.deltaY;
			const targetId = (e.target as HTMLElement).id;
			let processed = false;
			if (delta < 0) {
				processed = list.moveBy(-1, targetId);
			} else if (delta > 0) {
				processed = list.moveBy(1, targetId);
			}
			if (processed) {
				e.stopPropagation();
			}
		},
		[list, renderData],
		{ throttledReturn: undefined, limitMs: throttleMs },
	);

	useEffect(() => {
		list.addEventListener('renderData', onRenderData);
		return () => list.removeEventListener('renderData', onRenderData);
	}, [list, onRenderData]);

	useEffect(() => {
		if (typeof onDataIndex === 'function') {
			list.addEventListener('dataIndex', onDataIndex);
			return () => list.removeEventListener('dataIndex', onDataIndex);
		}
	}, [list, onDataIndex]);

	return (
		<FocusContext.Provider value={focusContextValue}>
			<div className="list" onWheel={onWheel}>
				<div
					className="list-inner-wrap"
					style={{
						transform: `translate${orientation === 'horizontal' ? 'X' : 'Y'}(-${renderData.listOffset}px)`,
					}}
				>
					{renderData.elements.map(renderItem)}
				</div>
			</div>
		</FocusContext.Provider>
	);
};
