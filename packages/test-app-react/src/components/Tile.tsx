import {
	useCallback,
	type DetailedHTMLProps,
	type HTMLAttributes,
} from 'react';
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
	&:focus {
		opacity: 1;
	}
	&:focus ${InnerWrap} {
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
	id,
	size = 'landscape',
	style,
}: {
	asset?: Asset;
	id?: string;
	size?: 'landscape' | 'portrait';
	style?: DetailedHTMLProps<
		HTMLAttributes<HTMLDivElement>,
		HTMLDivElement
	>['style'];
}) => {
	const onPress = useCallback(() => {}, []);

	return (
		<Wrap
			id={id}
			style={{ ...style, visibility: asset ? 'visible' : 'hidden' }}
			size={size}
			onPress={onPress}
		>
			<InnerWrap>
				<Image
					src={
						asset
							? tmdb.getImage(
									asset,
									size === 'landscape'
										? 'backdrop'
										: 'poster',
									WIDTH[size],
								)
							: ''
					}
					size={size}
				/>
				<Title>{asset?.title}</Title>
			</InnerWrap>
		</Wrap>
	);
};
