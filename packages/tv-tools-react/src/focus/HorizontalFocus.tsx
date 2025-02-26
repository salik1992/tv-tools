import type { KeyboardEvent, PropsWithChildren } from 'react';
import { useFocusContainer } from './useFocusContainer';
import { FocusContext } from './context';

/**
 * Component for markup of where the focus should navigate horizontally.
 * Direct focusable children will be navigated with left/right arrows in the order
 * they are placed in the DOM structure. This component does not render any
 * element. By default this component changes direction when the document is in the
 * right to left layout.
 *
 * @prop id - optional id if you need to address it manually
 * @prop ignoreRtl - optional override to keep the same direction in ltr/rtl layouts
 *
 * @example
 * ```typescriptreact
 * export const Menu = ({ ... }) => {
 *     // ...
 *     return (
 *          <div id="top-menu">
 *              <HorizontalFocus>
 *                  <MenuItem to="home">Home</MenuItem>
 *                  <MenuItem to="search">Search</MenuItem>
 *                  <MenuItem to="epg">EPG</MenuItem>
 *                  <MenuItem to="profile">My Profile</MenuItem>
 *              </HorizontalFocus>
 *          </div>
 *     )
 * }
 * ```
 * If the MenuItem are focusable (using Interactable component internally),
 * then when they are focused and we press left/right, the focus will move between
 * them in the order home <-> search <-> epg <-> profile.
 */
export const HorizontalFocus = ({
	id,
	ignoreRtl,
	children,
}: PropsWithChildren<{ id?: string; ignoreRtl?: boolean }>) => {
	const { focusContextValue, container, useOnLeft, useOnRight } =
		useFocusContainer(id);

	useOnLeft(
		// @ts-ignore: TODO reversed limitation
		(event: KeyboardEvent<HTMLElement>) => {
			return container.moveFocus(-1, (event.target as HTMLElement).id);
		},
		[container],
		{ ignoreRtl },
	);

	useOnRight(
		// @ts-ignore: TODO reversed limitation
		(event: KeyboardEvent<HTMLElement>) => {
			return container.moveFocus(1, (event.target as HTMLElement).id);
		},
		[container],
		{ ignoreRtl },
	);

	return (
		<FocusContext.Provider value={focusContextValue}>
			{children}
		</FocusContext.Provider>
	);
};
