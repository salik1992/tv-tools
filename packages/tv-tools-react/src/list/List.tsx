import {
	type KeyboardEvent,
	type WheelEvent,
	type ReactNode,
	useMemo,
	useState,
	useEffect,
} from 'react';
import type {
	ListImplementation,
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

	// Backwards movement from keys
	const backward = useThrottledCallback(
		(e: KeyboardEvent<HTMLElement>) => {
			const newRenderData = list.moveBy(-1, (e.target as HTMLElement).id);
			if (newRenderData === renderData) {
				return false;
			}
			setRenderData(newRenderData);
			return true;
		},
		[list, renderData],
		{ throttledReturn: true, limitMs: throttleMs },
	);

	// Forwards movement from keys
	const forward = useThrottledCallback(
		(e: KeyboardEvent<HTMLElement>) => {
			const newRenderData = list.moveBy(1, (e.target as HTMLElement).id);
			if (newRenderData === renderData) {
				return false;
			}
			setRenderData(newRenderData);
			return true;
		},
		[list, renderData],
		{ throttledReturn: true, limitMs: throttleMs },
	);

	// Attaching movement functions to key listeners
	if (orientation === 'horizontal') {
		// @ts-ignore: TODO reversed limitation
		useOnLeft(backward, [backward], { ignoreRtl });
		// @ts-ignore: TODO reversed limitation
		useOnRight(forward, [forward], { ignoreRtl });
	} else {
		// @ts-ignore: TODO reversed limitation
		useOnUp(backward, [backward]);
		// @ts-ignore: TODO reversed limitation
		useOnDown(forward, [forward]);
	}

	// Scrolling the wheel with pointer wheel.
	const onWheel = useThrottledCallback(
		(e: WheelEvent<HTMLElement>) => {
			const delta = e.deltaX || e.deltaY;
			const targetId = (e.target as HTMLElement).id;
			let newRenderData = renderData;
			if (delta < 0) {
				newRenderData = list.moveBy(-1, targetId);
			} else if (delta > 0) {
				newRenderData = list.moveBy(1, targetId);
			}
			if (newRenderData !== renderData) {
				setRenderData(newRenderData);
				e.preventDefault();
				e.stopPropagation();
			}
		},
		[list, renderData],
		{ throttledReturn: undefined, limitMs: throttleMs },
	);

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
