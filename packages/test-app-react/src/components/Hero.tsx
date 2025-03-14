import {
	useCallback,
	type DetailedHTMLProps,
	type FocusEvent,
	type HTMLAttributes,
} from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Interactable } from '@salik1992/tv-tools-react/focus';
import { Asset } from '@salik1992/test-app-data/types';
import { ImageWithFallback } from './Image';
import { H1, oneLineEllipsis, P } from './Typography';
import { useDataProvider } from '../data';

const WIDTH = 1000;
const MARGIN = 100;
const HEIGHT = 563;

const Image = styled(ImageWithFallback)<
	Pick<Parameters<typeof Hero>[0], 'size'>
>`
	background-size: cover;
	background-position: center center;
	width: ${WIDTH}px;
	height: ${HEIGHT}px;
`;

const InnerWrap = styled.div`
	position: relative;
	border-radius: 50px;
	transition: transform 300ms;
	overflow: hidden;
`;

const Shade = styled.div`
	position: absolute;
	top: 50%;
	bottom: 0;
	left: 0;
	right: 0;
	opacity: 0;
	background-image: linear-gradient(
		to bottom,
		transparent,
		rgba(0, 0, 0, 0.8)
	);
`;

const Text = css`
	position: absolute;
	left: 40px;
	max-width: ${WIDTH - 80}px;
	opacity: 0;
	transition: opacity 300ms;
	${oneLineEllipsis}
`;

const Title = styled(H1)`
	${Text}
	bottom: 70px;
	margin-bottom: 0;
`;

const Description = styled(P)`
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
	cursor: pointer;
	&:focus {
		opacity: 1;
	}
	&:focus ${InnerWrap} {
		transform: scale(1.1);
	}
	&:focus ${Title}, &:focus ${Description}, &:focus ${Shade} {
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
									{ width: WIDTH },
								)
							: ''
					}
					size={size}
				/>
				<Shade />
				<Title>{asset?.title}</Title>
				<Description>{asset?.description}</Description>
			</InnerWrap>
		</Wrap>
	);
};
Hero.width = WIDTH + MARGIN;
Hero.height = HEIGHT;
