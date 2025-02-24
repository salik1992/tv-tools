import type { PropsWithChildren } from 'react';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import { FocusContainer, RenderProgress } from '@salik1992/tv-tools/focus';
import { FocusContext } from './context';
import type { Focus } from './types';
import {
	getUseOnBack,
	getUseOnDown,
	getUseOnEnter,
	getUseOnKey,
	getUseOnLeft,
	getUseOnRight,
	getUseOnUp,
} from './keyboardHooks';

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
 *         FocusContextProvider, container,
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
 *             <FocusContextProvider>
 *                 {data.map(renderItem)}
 *              </FocusContextProvider>
 *          </div>
 *     )
 * }
 * ```
 */
export function useFocusContainer(id?: string) {
	const container = useMemo(() => new FocusContainer(id), [id]);
	const context = useContext(FocusContext);

	container.setRenderProgress(RenderProgress.STARTED);

	useEffect(() => {
		context.addChild(container.id);
		return () => {
			container.destroy();
		};
	}, [container]);

	const addChild = useCallback(
		(childId: string) => {
			container.addChild(childId);
		},
		[container],
	);

	useEffect(() => {
		container.setRenderProgress(RenderProgress.FINISHED);
	});

	const contextValue = useMemo((): Focus => ({ addChild }), [addChild]);

	const FocusContextProvider = useCallback(
		({ children }: PropsWithChildren) => {
			return (
				<FocusContext.Provider value={contextValue}>
					{children}
				</FocusContext.Provider>
			);
		},
		[contextValue],
	);

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
			FocusContextProvider,
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
			FocusContextProvider,
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
