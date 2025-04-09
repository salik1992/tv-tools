import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Interactable, VerticalFocus } from '@salik1992/tv-tools-react/focus';
import { useMenuItems } from '../hooks/useMenuItems';
import { getCurrentPath } from '../utils/getCurrentPath';
import { menuItemToPath } from '../utils/menuItemToPath';
import { Border, Colors, Transition } from './Theme';
import { H1, Typography } from './Typography';

const WIDTH = {
	closed: 4 * Typography.column,
	open: 20 * Typography.column,
	shade: 1920 - 20 * Typography.column,
} as const;

const Glyph = styled.span.attrs<{ $isActive: boolean }>(({ $isActive }) => ({
	style: {
		color: $isActive ? Colors.fg.focus : Colors.fg.secondary,
	},
}))`
	font-size: 2em;
	vertical-align: bottom;
	margin: 0 ${Typography.column}px;
`;

const Item = styled(Interactable).attrs<{ $isOpen: boolean }>(
	({ $isOpen }) => ({
		style: { width: `${$isOpen ? WIDTH.open : WIDTH.closed}px` },
	}),
)`
	color: ${Colors.fg.secondary};
	padding: ${Typography.column}px 0;
	cursor: pointer;
	white-space: nowrap;
	${Border}
	${Transition('color')}

	&:focus {
		color: ${Colors.fg.primary};
		border-color: ${Colors.fg.focus};
	}
`;

const ItemWrap = styled.div`
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
`;

const MenuBackground = styled.div.attrs<{ $isOpen: boolean }>(
	({ $isOpen }) => ({
		style: {
			width: `${$isOpen ? WIDTH.open : WIDTH.closed}px`,
		},
	}),
)`
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	background-color: ${Colors.bg.opaque};
`;

const MenuShade = styled.div.attrs<{ $isOpen: boolean }>(({ $isOpen }) => ({
	style: { width: `${$isOpen ? WIDTH.shade : 0}px` },
}))`
	position: absolute;
	top: 0;
	bottom: 0;
	left: ${WIDTH.open}px;
	background-color: ${Colors.bg.opaque};
`;

const Wrap = styled.div.attrs<{ $isOpen: boolean }>(({ $isOpen }) => ({
	style: {
		width: $isOpen ? '100%' : `${WIDTH.closed}px`,
		opacity: $isOpen ? 1 : 0.5,
	},
}))`
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	overflow: hidden;
	z-index: 10;
`;

export const Menu = ({
	id,
	isOpen,
	onMouseOpen,
	onMouseClose,
}: {
	id: string;
	isOpen: boolean;
	onMouseOpen: () => void;
	onMouseClose: () => void;
}) => {
	const navigate = useNavigate();
	const currentPath = getCurrentPath();
	const menuItems = useMenuItems();

	const onPresses = useMemo(
		() =>
			menuItems.map((item) => () => {
				const itemPath = menuItemToPath(item);
				onMouseClose();
				if (getCurrentPath() !== itemPath) {
					navigate(itemPath, { replace: true });
				}
				return true;
			}),
		[navigate, menuItems, onMouseClose],
	);

	return (
		<Wrap $isOpen={isOpen} onMouseOver={onMouseOpen}>
			<MenuBackground $isOpen={isOpen} />
			<MenuShade $isOpen={isOpen} onMouseOver={onMouseClose} />
			<ItemWrap>
				<VerticalFocus id={id}>
					{menuItems.map((item, i) => {
						const path = menuItemToPath(item);
						const isActive = currentPath === path;
						return (
							<Item
								key={path}
								$isOpen={isOpen}
								onPress={onPresses[i]}
								focusOnMount={isOpen && isActive}
							>
								<H1>
									<Glyph $isActive={isActive}>
										{item.glyph}
									</Glyph>
									{item.title}
								</H1>
							</Item>
						);
					})}
				</VerticalFocus>
			</ItemWrap>
		</Wrap>
	);
};
Menu.width = WIDTH;
