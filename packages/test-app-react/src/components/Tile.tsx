import styled from 'styled-components';
import { Interactable } from '@salik1992/tv-tools-react/focus';
import type { Asset } from '../data/types';
import { ImageWithFallback } from './Image';
import { tmdb } from '../data';

const WIDTH = {
	landscape: 240,
	portrait: 135,
} as const;

const Image = styled(ImageWithFallback)<
	Pick<Parameters<typeof Tile>[0], 'size'>
>`
	background-size: cover;
	background-position: center center;
	border-radius: 15px;
	width: ${({ size }) => (size === 'landscape' ? 240 : 135)}px;
	height: ${({ size }) => (size === 'landscape' ? 135 : 240)}px;
	transition: transform 300ms;
`;

const Wrap = styled(Interactable)<Pick<Parameters<typeof Tile>[0], 'size'>>`
	display: inline-block;
	width: ${({ size }) => (size === 'landscape' ? 240 : 135)}px;
	height: ${({ size }) => (size === 'landscape' ? 165 : 270)}px;
	margin-right: 20px;
	opacity: 0.7;
	transition:
		opacity 300ms,
		transform 300ms;
	outline: none;
	&:focus {
		opacity: 1;
		transform: scale(1.1);
	}
`;

const Title = styled.h3`
	margin: 0;
	line-height: 30px;
	text-align: center;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
`;

export const Tile = ({
	asset,
	size = 'landscape',
}: {
	asset: Asset;
	size?: 'landscape' | 'portrait';
}) => (
	<Wrap size={size}>
		<Image
			src={tmdb.getImage(
				asset,
				size === 'landscape' ? 'backdrop' : 'poster',
				WIDTH[size],
			)}
			size={size}
		/>
		<Title>{asset.title}</Title>
	</Wrap>
);
