import { type PropsWithChildren, useCallback, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
	FocusContext,
	useFocusContainer,
} from '@salik1992/tv-tools-react/focus';
import { useMenuItems } from '../hooks/useMenuItems';
import { getCurrentPath } from '../utils/getCurrentPath';
import { menuItemToPath } from '../utils/menuItemToPath';
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

	useOnLeft(openMenu);

	useOnRight(closeMenu);

	useOnBack(() => {
		if (isMenuVisible) {
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
