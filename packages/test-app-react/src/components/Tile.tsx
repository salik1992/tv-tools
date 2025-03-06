import {
	useCallback,
	type DetailedHTMLProps,
	type FocusEvent,
	type HTMLAttributes,
} from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Interactable } from '@salik1992/tv-tools-react/focus';
import type { Asset } from '@salik1992/test-app-data/types';
import { useDataProvider } from '../data';
import { ImageWithFallback } from './Image';
import { oneLineEllipsis, P } from './Typography';

const WIDTH = {
	landscape: 240,
	portrait: 135,
	margin: 30,
} as const;

const Image = styled(ImageWithFallback)<
	Pick<Parameters<typeof Tile>[0], 'size'>
>`
	background-size: cover;
	background-position: center center;
	border-radius: 15px;
	width: ${({ size }) => (size === 'landscape' ? 240 : 135)}px;
	height: ${({ size }) => (size === 'landscape' ? 135 : 240)}px;
`;

const InnerWrap = styled.div`
	transition: transform 300ms;
`;

const Wrap = styled(Interactable)<Pick<Parameters<typeof Tile>[0], 'size'>>`
	display: inline-block;
	width: ${({ size }) => (size === 'landscape' ? 240 : 135)}px;
	height: ${({ size }) => (size === 'landscape' ? 165 : 270)}px;
	margin-right: 30px;
	opacity: 0.7;
	transition: opacity 300ms;
	outline: none;
	cursor: pointer;
	&:focus {
		opacity: 1;
	}
	&:focus ${InnerWrap} {
		transform: scale(1.1);
	}
`;

const Title = styled(P)`
	margin: 0;
	line-height: 30px;
	text-align: center;
	${oneLineEllipsis}
`;

export const Tile = ({
	asset,
	id,
	size = 'landscape',
	style,
	onFocus,
}: {
	asset?: Asset;
	id?: string;
	size?: 'landscape' | 'portrait';
	style?: DetailedHTMLProps<
		HTMLAttributes<HTMLDivElement>,
		HTMLDivElement
	>['style'];
	onFocus?: (event: FocusEvent) => void;
}) => {
	const dataProvider = useDataProvider();
	const navigate = useNavigate();

	const onPress = useCallback(() => {
		navigate(`detail/${asset?.type}/${asset?.id}`);
		return true;
	}, [navigate, asset]);

	return (
		<Wrap
			id={id}
			style={{ ...style, visibility: asset ? 'visible' : 'hidden' }}
			size={size}
			onPress={onPress}
			onFocus={onFocus}
		>
			<InnerWrap>
				<Image
					src={
						asset
							? dataProvider.getImageUrl(
									asset,
									size === 'landscape'
										? ['backdrop']
										: ['poster'],
									{ width: WIDTH[size] },
								)
							: ''
					}
					size={size}
				/>
				<Title>{asset?.title ?? '-'}</Title>
			</InnerWrap>
		</Wrap>
	);
};
Tile.width = {
	landscape: WIDTH.landscape + WIDTH.margin,
	portrait: WIDTH.portrait + WIDTH.margin,
};
Tile.height = {
	landscape: WIDTH.portrait + WIDTH.margin,
	portrait: WIDTH.landscape + WIDTH.margin,
};
