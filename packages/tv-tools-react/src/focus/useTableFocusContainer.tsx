import { TableFocusContainer } from '@salik1992/tv-tools/focus';
import { useContainer } from './useContainer';

/**
 * Hook containing common functionality for table focus containers (e.g.
 * VirtualKeyboard).
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
 * const Keyboard = ({ columns, data, renderItem }) => {
 *     const {
 *         focusContextValue, container,
 *         useOnLeft, useOnRight, useOnUp, useOnDown,
 *     } = useTableFocusContainer();
 *
 *     useOnLeft(
 *         (event) => container.moveFocus({ x: -1 }, event.target.id),
 *         [container],
 *     )
 *     useOnRight(
 *         (event) => container.moveFocus({ x: 1 }, event.target.id),
 *         [container],
 *     )
 *     useOnUp(
 *         (event) => container.moveFocus({ y: -1 }, event.target.id),
 *         [container, columns],
 *     )
 *     useOnDown(
 *         (event) => container.moveFocus({ y: 1 }, event.target.id),
 *         [container, columns],
 *     )
 *
 *     return (
 *         <div className="keyboard">
 *             <FocusContext.Provider value={focusContextValue}>
 *                 // render layout
 *              </FocusContext.Provider>
 *          </div>
 *     )
 * }
 * ```
 */
export function useTableFocusContainer(id?: string) {
	return useContainer(TableFocusContainer, id);
}
