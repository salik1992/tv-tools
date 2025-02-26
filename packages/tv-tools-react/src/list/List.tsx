import {
	type KeyboardEvent,
	type WheelEvent,
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import type {
	ListImplementation,
	RenderDataElement,
} from '@salik1992/tv-tools/list';
import { useFocusContainer } from '../focus';

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
}: {
	id?: string;
	Implementation: Implementation;
	configuration: Omit<Configuration, 'id'>;
	renderItem: (element: RenderDataElement) => ReactNode;
	orientation: 'vertical' | 'horizontal';
}) => {
	const {
		container,
		FocusContextProvider,
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

	const backward = useCallback(
		(e: KeyboardEvent<HTMLElement>) => {
			const newRenderData = list.moveBy(-1, (e.target as HTMLElement).id);
			if (newRenderData === renderData) {
				return false;
			}
			setRenderData(newRenderData);
			return true;
		},
		[list, renderData],
	);

	const forward = useCallback(
		(e: KeyboardEvent<HTMLElement>) => {
			const newRenderData = list.moveBy(1, (e.target as HTMLElement).id);
			if (newRenderData === renderData) {
				return false;
			}
			setRenderData(newRenderData);
			return true;
		},
		[list, renderData],
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

	const lastWheelEvent = useRef(0);
	const onWheel = useCallback(
		(e: WheelEvent<HTMLElement>) => {
			if (lastWheelEvent.current + 500 > Date.now()) {
				return;
			}
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
				lastWheelEvent.current = Date.now();
				e.preventDefault();
				e.stopPropagation();
			}
		},
		[list, renderData],
	);

	return (
		<FocusContextProvider>
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
		</FocusContextProvider>
	);
};
