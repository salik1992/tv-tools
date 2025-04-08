import {
	type DetailedHTMLProps,
	type FocusEvent,
	type HTMLAttributes,
	useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Interactable } from '@salik1992/tv-tools-react/focus';
import { isGenre, isPerson } from '@salik1992/test-app-data/guards';
import type {
	Asset,
	AssetType,
	PersonAsset,
} from '@salik1992/test-app-data/types';
import { useDataProvider } from '../data';
import { ImageWithFallback } from './Image';
import { Border, Colors, Transition } from './Theme';
import { P, Typography, oneLineEllipsis } from './Typography';

const WIDTH = 16 * Typography.column;
const HEIGHT = 6 * Typography.row;
const PERSON_HEIGHT = 8 * Typography.row;
const MARGIN = 2 * Typography.column;

const IMAGE_WIDTH = 14 * Typography.column;
const IMAGE_HEIGHT = 4 * Typography.row;
const PERSON_IMAGE_HEIGHT = 5 * Typography.row;

const Image = styled(ImageWithFallback)<{ $type?: AssetType }>`
	background-size: cover;
	background-position: center center;
	width: ${IMAGE_WIDTH}px;
	height: ${({ $type }) =>
		$type === 'person' ? PERSON_IMAGE_HEIGHT : IMAGE_HEIGHT}px;
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

const Wrap = styled(Interactable)<{ $type?: AssetType }>`
	display: inline-block;
	width: ${WIDTH}px;
	height: ${({ $type }) => ($type === 'person' ? PERSON_HEIGHT : HEIGHT)}px;
	margin-right: ${MARGIN}px;
	padding: ${Typography.column}px ${Typography.column}px;
	${Border}
	outline: none;
	cursor: pointer;
	&:focus ${Title} {
		color: ${Colors.fg.primary};
	}
`;

const PersonTile = ({ asset }: { asset?: PersonAsset }) => {
	const dataProvider = useDataProvider();

	return (
		<>
			<Image
				$type="person"
				src={
					asset
						? dataProvider.getImageUrl(asset, ['profile'], {
								width: WIDTH,
							})
						: ''
				}
			/>
			<Title>
				{asset?.title ?? '-'}
				<br />
				{asset?.role && asset.role.length ? asset.role : '-'}
			</Title>
		</>
	);
};

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

const getTile = (asset?: Asset) => {
	if (asset && isGenre(asset)) {
		return TileWithoutImage;
	} else if (asset && isPerson(asset)) {
		return PersonTile;
	}
	return TileWithImage;
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
		const replace = window.location.hash.indexOf('/detail/') !== -1;
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
				navigate(
					`${replace ? '../' : ''}detail/${asset.type}/${asset.id}`,
				);
		}
		return true;
	}, [navigate, asset]);

	const TileComponent = getTile(asset);

	return (
		<Wrap
			$type={asset?.type}
			id={id}
			style={{ ...style, visibility: asset ? 'visible' : 'hidden' }}
			onPress={onPress}
			onFocus={onFocus}
		>
			{/* @ts-expect-error: asset mapping */}
			{<TileComponent asset={asset} />}
		</Wrap>
	);
};
Tile.width = WIDTH + MARGIN;
Tile.height = HEIGHT;
