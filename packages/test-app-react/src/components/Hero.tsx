import {
	useCallback,
	type DetailedHTMLProps,
	type HTMLAttributes,
} from 'react';
import styled, { css } from 'styled-components';
import { Interactable } from '@salik1992/tv-tools-react/focus';
import { tmdb } from '../data';
import type { Asset } from '../data/types';
import { ImageWithFallback } from './Image';
import { H1, H4, oneLineEllipsis } from './Typography';

const WIDTH = 1000;
const MARGIN = 100;
const HEIGHT = 563;

const Image = styled(ImageWithFallback)<
	Pick<Parameters<typeof Hero>[0], 'size'>
>`
	background-size: cover;
	background-position: center center;
	border-radius: 50px;
	width: ${WIDTH}px;
	height: ${HEIGHT}px;
`;

const InnerWrap = styled.div`
	position: relative;
	transition: transform 300ms;
`;

const Text = css`
	position: absolute;
	left: 40px;
	max-width: ${WIDTH - 80}px;
	opacity: 1;
	transition: opacity 300ms;
	${oneLineEllipsis}
`;

const Title = styled(H1)`
	${Text}
	bottom: 70px;
`;

const Description = styled(H4)`
	${Text}
	bottom: 20px;
`;

const Wrap = styled(Interactable)<Pick<Parameters<typeof Hero>[0], 'size'>>`
	display: inline-block;
	width: ${WIDTH}px;
	height: ${HEIGHT}px;
	margin-right: ${MARGIN}px;
	opacity: 0.7;
	transition: opacity 300ms;
	outline: none;
	&:focus {
		opacity: 1;
	}
	&:focus ${InnerWrap} {
		transform: scale(1.1);
	}
	&:focus ${Title}, &:focus ${Description} {
		opacity: 1;
	}
`;

export const Hero = ({
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
	const onPress = useCallback(() => {}, []);

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
							? tmdb.getImage(
									asset,
									size === 'landscape'
										? 'backdrop'
										: 'poster',
									WIDTH,
								)
							: ''
					}
					size={size}
				/>
				<Title>{asset?.title}</Title>
				<Description>{asset?.description}</Description>
			</InnerWrap>
		</Wrap>
	);
};
Hero.width = WIDTH + MARGIN;
Hero.height = HEIGHT;
