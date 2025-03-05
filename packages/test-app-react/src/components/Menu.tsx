import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { VerticalFocus, Interactable } from '@salik1992/tv-tools-react/focus';
import iconGenres from '../assets/icon-genres.png';
import iconHome from '../assets/icon-home.png';
import iconSearch from '../assets/icon-search.png';
import { H3 } from './Typography';

const ITEMS = [
	{ title: 'Home', icon: iconHome, path: '/' },
	{ title: 'Search', icon: iconSearch, path: '/search' },
	{ title: 'Genres', icon: iconGenres, path: '/discover/genres' },
] as const;

const WIDTH = {
	closed: '80px',
	open: '350px',
	shade: `${1920 - 350}px`,
} as const;

const Icon = styled.div.attrs<{ $isActive: boolean; $src: string }>(
	({ $isActive, $src }) => ({
		style: {
			opacity: $isActive ? '1' : '0.6',
			backgroundImage: `url(${$src})`,
		},
	}),
)`
	display: inline-block;
	width: 50px;
	height: 50px;
	margin-left: 15px;
	margin-right: 30px;
	background-size: cover;
	background-position: center center;
`;

const Title = styled(H3)`
	display: inline-block;
	line-height: 50px;
	margin: 0;
	vertical-align: top;
`;

const Item = styled(Interactable).attrs<{ $isOpen: boolean }>(
	({ $isOpen }) => ({
		style: { width: $isOpen ? WIDTH.open : WIDTH.closed },
	}),
)`
	margin-bottom: 30px;
	outline: none;
	cursor: pointer;
	white-space: nowrap;

	${Icon}, ${Title} {
		opacity: 0.5;
	}

	&:focus ${Icon}, &:focus ${Title} {
		opacity: 1 !important;
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
			width: $isOpen ? WIDTH.open : WIDTH.closed,
			backgroundColor: $isOpen
				? 'rgba(0, 0, 0, 0.85)'
				: 'rgba(0, 0, 0, 0.25)',
		},
	}),
)`
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
`;

const MenuShade = styled.div.attrs<{ $isOpen: boolean }>(({ $isOpen }) => ({
	style: { width: $isOpen ? WIDTH.shade : '0px' },
}))`
	position: absolute;
	top: 0;
	bottom: 0;
	left: ${WIDTH.open};
	background-image: linear-gradient(
		to right,
		rgba(0, 0, 0, 0.85),
		rgba(0, 0, 0, 0.25)
	);
`;

const Wrap = styled.div.attrs<{ $isOpen: boolean }>(({ $isOpen }) => ({
	style: { width: $isOpen ? '100%' : WIDTH.closed },
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
		() => ITEMS.map((item) => navigate(item.path, { replace: true })),
		[navigate, ITEMS],
	);

	return (
		<Wrap $isOpen={isOpen} onMouseOver={onMouseOpen}>
			<MenuBackground $isOpen={isOpen} />
			<MenuShade $isOpen={isOpen} onClick={onMouseClose} />
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
								<Icon $isActive={isActive} $src={item.icon} />
								<Title>{item.title}</Title>
							</Item>
						);
					})}
				</VerticalFocus>
			</ItemWrap>
		</Wrap>
	);
};
