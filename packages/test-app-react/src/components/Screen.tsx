import { useCallback, useState, type PropsWithChildren } from 'react';
import styled from 'styled-components';
import {
	useFocusContainer,
	FocusContext,
} from '@salik1992/tv-tools-react/focus';
import { Menu } from './Menu';

const MENU = 'menu';

const ScreenContainer = styled.div<{ $withMenu: boolean }>`
	width: 1920px;
	height: 1080px;
	padding-left: ${({ $withMenu }) => ($withMenu ? 120 : 40)}px;
	padding-right: 40px;
	overflow: hidden;
	box-sizing: border-box;
`;

export const Screen = ({
	children,
	className,
	withMenu = false,
}: PropsWithChildren<{ withMenu?: boolean; className?: string }>) => {
	const { focusContextValue, container, useOnLeft, useOnRight, useOnBack } =
		useFocusContainer();
	const [isMenuVisible, setIsMenuVisible] = useState(false);

	const openMenu = useCallback(() => {
		if (withMenu && !isMenuVisible) {
			setIsMenuVisible(true);
			return true;
		}
		return false;
	}, [isMenuVisible, setIsMenuVisible]);

	const closeMenu = useCallback(() => {
		if (withMenu && isMenuVisible) {
			setIsMenuVisible(false);
			container.moveFocus(1, MENU);
			return true;
		}
		return false;
	}, [isMenuVisible, setIsMenuVisible]);

	const toggleMenu = useCallback(
		() => (isMenuVisible ? closeMenu() : openMenu()),
		[isMenuVisible, openMenu, closeMenu],
	);

	useOnLeft(openMenu);

	useOnRight(closeMenu);

	useOnBack(toggleMenu);

	return (
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
	);
};
