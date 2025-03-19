import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Interactable, VerticalFocus } from '@salik1992/tv-tools-react/focus';
import { Border, Colors, Transition } from './Theme';
import { H1, Typography } from './Typography';

const ITEMS = [
	{ title: 'Home', glyph: '\u2302', path: '/' },
	{ title: 'Search', glyph: '\u2328', path: '/search' },
	{ title: 'Genres', glyph: '\u2388', path: '/discover/genres' },
] as const;

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
	outline: none;
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

const getCurrentPath = () => {
	const hash = location.hash.replace(/^#/, '');
	return hash.length ? hash : '/';
};

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

	const onPresses = useMemo(
		() =>
			ITEMS.map((item) => () => {
				navigate(item.path, { replace: true });
				return true;
			}),
		[navigate, ITEMS],
	);

	return (
		<Wrap $isOpen={isOpen} onMouseOver={onMouseOpen}>
			<MenuBackground $isOpen={isOpen} />
			<MenuShade $isOpen={isOpen} onMouseOver={onMouseClose} />
			<ItemWrap>
				<VerticalFocus id={id}>
					{ITEMS.map((item, i) => {
						const isActive = isOpen && currentPath === item.path;
						return (
							<Item
								key={item.path}
								$isOpen={isOpen}
								onPress={onPresses[i]}
								focusOnMount={isActive}
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
