import {
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useMemo,
} from 'react';
import { FocusContainer, RenderProgress } from '@salik1992/tv-tools/focus';
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
import type { Focus } from './types';
import { useRefresh } from './useRefresh';

/**
 * Hook containing common functionality for focus containers (HorizontalFocus,
 * VerticalFocus, List, Grid, etc.)
 * It takes care of pairing the direct focus children to this container.
 * It also provides hooks for attaching key event listeners and allows access
 * to underlying FocusContainer instance from the core tv-tools package.
 *
 * @param id - optional id of the focus container in focus management. Required
 * only if you need to address it manually.
 *
 * @example
 * ```typescriptreact
 * // SIMPLIFIED
 * const Grid = ({ columns, data, renderItem }) => {
 *     const {
 *         focusContextValue, container,
 *         useOnLeft, useOnRight, useOnUp, useOnDown,
 *     } = useFocusContainer();
 *
 *     useOnLeft(
 *         (event) => container.moveFocus(-1, event.target.id),
 *         [container],
 *     )
 *     useOnRight(
 *         (event) => container.moveFocus(1, event.target.id),
 *         [container],
 *     )
 *     useOnUp(
 *         (event) => container.moveFocus(-columns, event.target.id),
 *         [container, columns],
 *     )
 *     useOnDown(
 *         (event) => container.moveFocus(columns, event.target.id),
 *         [container, columns],
 *     )
 *
 *     return (
 *         <div className="grid">
 *             <FocusContext.Provider value={focusContextValue}>
 *                 {data.map(renderItem)}
 *              </FocusContext.Provider>
 *          </div>
 *     )
 * }
 * ```
 */
export function useFocusContainer(id?: string) {
	const container = useMemo(() => new FocusContainer(id), [id]);
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
		(childId: string) => {
			if (container.getRenderProgress() === RenderProgress.FINISHED) {
				refresh();
			} else {
				container.addChild(childId);
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
			container,
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
