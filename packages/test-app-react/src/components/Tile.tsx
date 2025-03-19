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
import { oneLineEllipsis, P, Typography } from './Typography';
import { Border, Colors, Transition } from './Theme';

const WIDTH = 16 * Typography.column;
const HEIGHT = 6 * Typography.row;
const MARGIN = 2 * Typography.column;

const IMAGE_WIDTH = 14 * Typography.column;
const IMAGE_HEIGHT = 4 * Typography.row;

const Image = styled(ImageWithFallback)`
	background-size: cover;
	background-position: center center;
	width: ${IMAGE_WIDTH}px;
	height: ${IMAGE_HEIGHT}px;
`;

const Title = styled(P)`
	color: ${Colors.fg.secondary};
	${Transition('color')}
	${oneLineEllipsis}
`;

const Wrap = styled(Interactable)`
	display: inline-block;
	width: ${WIDTH}px;
	height: ${HEIGHT}px;
	margin-right: ${MARGIN}px;
	padding: ${Typography.column}px ${Typography.column}px;
	${Border}
	outline: none;
	cursor: pointer;
	&:focus ${Title} {
		color: ${Colors.fg.primary};
	}
`;

export const Tile = ({
	asset,
	id,
	style,
	onFocus,
}: {
	asset?: Asset;
	id?: string;
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
			onPress={onPress}
			onFocus={onFocus}
		>
			<Image
				src={
					asset
						? dataProvider.getImageUrl(
								asset,
								['backdrop', 'still'],
								{ width: WIDTH },
							)
						: ''
				}
			/>
			<Title>{asset?.title ?? '-'}</Title>
		</Wrap>
	);
};
Tile.width = WIDTH + MARGIN;
Tile.height = HEIGHT;
