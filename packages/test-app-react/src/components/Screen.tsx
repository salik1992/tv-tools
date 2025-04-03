import { type PropsWithChildren, useCallback, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { device } from '@salik1992/tv-tools/device';
import {
	FocusContext,
	useFocusContainer,
} from '@salik1992/tv-tools-react/focus';
import { useMenuItems } from '../hooks/useMenuItems';
import { getCurrentPath } from '../utils/getCurrentPath';
import { menuItemToPath } from '../utils/menuItemToPath';
import { useConfirm } from './Confirm';
import { Menu } from './Menu';
import { Colors } from './Theme';
import { Typography } from './Typography';

const MENU = 'menu';

const ScreenContainer = styled.div<{ $withMenu: boolean }>`
	position: absolute;
	top: 0;
	left: 0;
	width: 1920px;
	height: 1080px;
	padding-left: ${({ $withMenu }) =>
		($withMenu ? Menu.width.closed : 0) + 3 * Typography.column}px;
	padding-right: ${3 * Typography.column}px;
	overflow: hidden;
	box-sizing: border-box;
	background-color: ${Colors.bg.primary};
	z-index: 0; // Reset for nested routes to keep the content within
`;

export const Screen = ({
	children,
	className,
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
			<ScreenContainer className={className} $withMenu={withMenu}>
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
			</ScreenContainer>
			<Outlet />
		</>
	);
};
