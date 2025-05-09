import { FocusContainer } from '@salik1992/tv-tools/focus';
import { useContainer } from './useContainer';

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
	return useContainer(FocusContainer, id);
}
