import { type PropsWithChildren, useCallback, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { device } from '@salik1992/tv-tools/device';
import {
	FocusContext,
	useFocusContainer,
} from '@salik1992/tv-tools-react/focus';
import { useConfirm } from '../../hooks/useConfirm';
import { useMenuItems } from '../../hooks/useMenuItems';
import { getCurrentPath } from '../../utils/getCurrentPath';
import { menuItemToPath } from '../../utils/menuItemToPath';
import { Menu } from '../Menu';
import * as css from './Screen.module.scss';

const MENU = 'menu';

export const Screen = ({
	children,
	className = '',
	backNavigation,
}: PropsWithChildren<{
	withMenu?: boolean;
	className?: string;
	backNavigation?: string | number;
}>) => {
	const { focusContextValue, container, useOnLeft, useOnRight, useOnBack } =
		useFocusContainer();
	const [isMenuVisible, setIsMenuVisible] = useState(false);
	const navigate = useNavigate();
	const menuItems = useMenuItems();
	const currentPath = getCurrentPath();
	const withMenu = !!menuItems.find(
		(item) => menuItemToPath(item) === currentPath,
	);
	const confirm = useConfirm();

	const openMenu = useCallback(() => {
		if (withMenu && !isMenuVisible) {
			setIsMenuVisible(true);
			return true;
		}
		return false;
	}, [withMenu, isMenuVisible, setIsMenuVisible]);

	const closeMenu = useCallback(() => {
		if (withMenu && isMenuVisible) {
			setIsMenuVisible(false);
			container.moveFocus(1, MENU);
			return true;
		}
		return false;
	}, [withMenu, isMenuVisible, setIsMenuVisible]);

	const closeApplication = useCallback(async () => {
		if (await confirm('Do you really want to close the application?')) {
			device.closeApplication();
		}
	}, [confirm]);

	useOnLeft(openMenu);

	useOnRight(closeMenu);

	useOnBack(() => {
		if (isMenuVisible) {
			if (device.canCloseApplication) {
				closeApplication();
			}
			return closeMenu();
		} else if (backNavigation && !withMenu) {
			// @ts-expect-error: backNavigation is either a string or a number
			navigate(backNavigation);
			return true;
		}
		return openMenu();
	}, [isMenuVisible, closeMenu, openMenu, backNavigation, navigate]);

	return (
		<>
			<div
				className={`${css.container} ${withMenu ? css['with-menu'] : ''} ${className}`}
			>
				<FocusContext.Provider value={focusContextValue}>
					{withMenu && (
						<Menu
							id={MENU}
							isOpen={isMenuVisible}
							onMouseOpen={openMenu}
							onMouseClose={closeMenu}
						/>
					)}
					{children}
				</FocusContext.Provider>
			</div>
			<Outlet />
		</>
	);
};
