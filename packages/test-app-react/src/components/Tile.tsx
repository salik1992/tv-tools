import {
	type DetailedHTMLProps,
	type FocusEvent,
	type HTMLAttributes,
	useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Interactable } from '@salik1992/tv-tools-react/focus';
import { isGenre } from '@salik1992/test-app-data/guards';
import type { Asset } from '@salik1992/test-app-data/types';
import { useDataProvider } from '../data';
import { ImageWithFallback } from './Image';
import { Border, Colors, Transition } from './Theme';
import { P, Typography, oneLineEllipsis } from './Typography';

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

const ColorBox = styled.div`
	background-color: ${Colors.bg.action};
	color: ${Colors.bg.primary};
	width: ${IMAGE_WIDTH}px;
	height: ${IMAGE_HEIGHT}px;
	box-sizing: border-box;
	padding-top: ${1.5 * Typography.row}px;
	text-align: center;
`;

const ColorBoxText = styled(P)`
	${oneLineEllipsis}
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

const TileWithImage = ({ asset }: { asset?: Asset }) => {
	const dataProvider = useDataProvider();

	return (
		<>
			<Image
				src={
					asset
						? dataProvider.getImageUrl(
								asset,
								['backdrop', 'still', 'poster', 'profile'],
								{ width: WIDTH },
							)
						: ''
				}
			/>
			<Title>{asset?.title ?? '-'}</Title>
		</>
	);
};

const TileWithoutImage = ({ asset }: { asset?: Asset }) => {
	return (
		<>
			<ColorBox>
				<ColorBoxText>{asset?.title.toLowerCase() ?? '-'}</ColorBoxText>
			</ColorBox>
			<Title>{asset?.title ?? '-'}</Title>
		</>
	);
};

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
	const navigate = useNavigate();

	const onPress = useCallback(() => {
		if (!asset) {
			return false;
		}
		switch (asset?.type) {
			case 'genre':
				navigate(
					`/discover/${btoa(
						JSON.stringify({
							filterBy: 'genre',
							id: asset.id,
							type: asset.relatedAssetType,
							title: asset.title,
							relatedPageItem: asset.relatedAssetType,
						}),
					)}`,
				);
				break;
			default:
				navigate(`detail/${asset.type}/${asset.id}`);
		}
		return true;
	}, [navigate, asset]);

	return (
		<Wrap
			id={id}
			style={{ ...style, visibility: asset ? 'visible' : 'hidden' }}
			onPress={onPress}
			onFocus={onFocus}
		>
			{asset && isGenre(asset) ? (
				<TileWithoutImage asset={asset} />
			) : (
				<TileWithImage asset={asset} />
			)}
		</Wrap>
	);
};
Tile.width = WIDTH + MARGIN;
Tile.height = HEIGHT;
