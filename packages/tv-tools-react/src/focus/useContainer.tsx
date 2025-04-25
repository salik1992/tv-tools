import {
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useMemo,
} from 'react';
import {
	type FocusContainer,
	RenderProgress,
	type TableFocusContainer,
} from '@salik1992/tv-tools/focus';
import { FocusContext } from './context';
import {
	getUseOnBack,
	getUseOnDown,
	getUseOnEnter,
	getUseOnKey,
	getUseOnLeft,
	getUseOnRight,
	getUseOnUp,
} from './keyboardHooks';
import { Focus } from './types';
import { useRefresh } from './useRefresh';

export function useContainer<
	C extends typeof FocusContainer | typeof TableFocusContainer,
>(Container: C, id?: string) {
	const container = useMemo(() => new Container(id), [id]);
	const context = useContext(FocusContext);
	const refresh = useRefresh();

	container.setRenderProgress(RenderProgress.STARTED);

	useLayoutEffect(
		() => () => {
			container.destroy();
		},
		[container],
	);

	useEffect(() => {
		// Needs to run every time to maintain children order.
		context.addChild(container.id);
	});

	const addChild = useCallback(
		(childId: string, spans?: { colSpan?: number; rowSpan?: number }) => {
			if (container.getRenderProgress() === RenderProgress.FINISHED) {
				refresh();
			} else {
				container.addChild(childId, spans);
			}
		},
		[container, refresh, context.addChild],
	);

	useEffect(() => {
		container.setRenderProgress(RenderProgress.FINISHED);
	});

	const focusContextValue = useMemo((): Focus => ({ addChild }), [addChild]);

	const useOnKeyDown = useCallback(getUseOnKey(container.id), [container.id]);
	const useOnEnter = useCallback(getUseOnEnter(container.id), [container.id]);
	const useOnBack = useCallback(getUseOnBack(container.id), [container.id]);
	const useOnLeft = useCallback(getUseOnLeft(container.id), [container.id]);
	const useOnRight = useCallback(getUseOnRight(container.id), [container.id]);
	const useOnUp = useCallback(getUseOnUp(container.id), [container.id]);
	const useOnDown = useCallback(getUseOnDown(container.id), [container.id]);

	return useMemo(
		() => ({
			container: container as InstanceType<C>,
			focusContextValue,
			useOnKeyDown,
			useOnEnter,
			useOnBack,
			useOnLeft,
			useOnRight,
			useOnUp,
			useOnDown,
		}),
		[
			container,
			focusContextValue,
			useOnKeyDown,
			useOnEnter,
			useOnBack,
			useOnLeft,
			useOnRight,
			useOnUp,
			useOnDown,
		],
	);
}
