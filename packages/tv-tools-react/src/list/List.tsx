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
}: {
	id?: string;
	Implementation: Implementation;
	configuration: Omit<Configuration, 'id'>;
	renderItem: (element: RenderDataElement) => ReactNode;
	orientation?: 'vertical' | 'horizontal';
	focusOnMount?: boolean;
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
	const list = useMemo(
		() =>
			new Implementation(container, {
				id: container.id,
				...configuration,
			}),
		[Implementation, configuration, container],
	);
	const [renderData, setRenderData] = useState(list.getRenderData());

	useEffect(() => {
		if (focusOnMount) {
			container.focus({ preventScroll: true });
		}
	}, [focusOnMount]);

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
		{ throttledReturn: false, limitMs: throttleMs },
	);

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
		{ throttledReturn: false, limitMs: throttleMs },
	);

	if (orientation === 'horizontal') {
		// @ts-ignore: TODO reversed limitation
		useOnLeft(backward, [backward]);
		// @ts-ignore: TODO reversed limitation
		useOnRight(forward, [forward]);
	} else {
		// @ts-ignore: TODO reversed limitation
		useOnUp(backward, [backward]);
		// @ts-ignore: TODO reversed limitation
		useOnDown(forward, [forward]);
	}

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
