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
import { useDataProvider } from '../data';
import { ImageWithFallback } from './Image';
import { H1, NBSP, oneLineEllipsis, P, Typography } from './Typography';
import { Border, Colors, Transition } from './Theme';

const WIDTH = 66 * Typography.column;
const HEIGHT = 19 * Typography.row;
const MARGIN = 5 * Typography.column;

const IMAGE_WIDTH = 64 * Typography.column;
const IMAGE_HEIGHT = 15 * Typography.row;

const Image = styled(ImageWithFallback)<
	Pick<Parameters<typeof Hero>[0], 'size'>
>`
	background-size: cover;
	background-position: center center;
	width: ${IMAGE_WIDTH}px;
	height: ${IMAGE_HEIGHT}px;
	margin-bottom: ${Typography.row}px;
`;

const Text = css`
	color: ${Colors.fg.secondary};
	${Transition('color')}
	${oneLineEllipsis}
`;

const Title = styled(H1)`
	${Text}
`;

const Description = styled(P)`
	${Text}
`;

const Wrap = styled(Interactable)<Pick<Parameters<typeof Hero>[0], 'size'>>`
	display: inline-block;
	width: ${WIDTH}px;
	height: ${HEIGHT}px;
	margin-right: ${MARGIN}px;
	padding: ${Typography.column}px ${Typography.column}px;
	${Border}
	outline: none;
	cursor: pointer;
	&:focus ${Title}, &:focus ${Description} {
		color: ${Colors.fg.primary};
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
			<Title>{asset?.title ?? NBSP}</Title>
			<Description>{asset?.description ?? NBSP}</Description>
		</Wrap>
	);
};
Hero.width = WIDTH + MARGIN;
Hero.height = HEIGHT;
