import { type PropsWithChildren } from 'react';
import { useFocusContainer } from './useFocusContainer';

/**
 * Component for markup of where the focus should navigate vertically.
 * Direct focusable children will be navigated with up/down arrows in the order
 * they are placed in the DOM structure. This component does not render any
 * element.
 *
 * @prop id - optional id if you need to address it manually
 *
 * @example
 * ```typescriptreact
 * export const Menu = ({ ... }) => {
 *     // ...
 *     return (
 *          <div id="side-menu">
 *              <VerticalFocus>
 *                  <MenuItem to="home">Home</MenuItem>
 *                  <MenuItem to="search">Search</MenuItem>
 *                  <MenuItem to="epg">EPG</MenuItem>
 *                  <MenuItem to="profile">My Profile</MenuItem>
 *              </VerticalFocus>
 *          </div>
 *     )
 * }
 * ```
 * If the MenuItem are focusable (using Interactable component internally),
 * then when they are focused and we press up/down, the focus will move between
 * them in the order home <-> search <-> epg <-> profile.
 */
export const VerticalFocus = ({
	id,
	children,
}: PropsWithChildren<{ id?: string }>) => {
	const { FocusContextProvider, container, useOnUp, useOnDown } =
		useFocusContainer(id);

	useOnUp(
		(event) => {
			return container.moveFocus(-1, (event.target as HTMLElement).id);
		},
		[container],
	);

	useOnDown(
		(event) => {
			return container.moveFocus(1, (event.target as HTMLElement).id);
		},
		[container],
	);

	return <FocusContextProvider>{children}</FocusContextProvider>;
};
