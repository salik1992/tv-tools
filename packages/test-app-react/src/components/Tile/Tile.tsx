import { type ComponentProps, type FocusEvent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Interactable } from '@salik1992/tv-tools-react/focus';
import { isGenre, isPerson, isShowAll } from '@salik1992/test-app-data/guards';
import type {
	Asset,
	PersonAsset,
	ShowAllAsset,
} from '@salik1992/test-app-data/types';
import { useDataProvider } from '../../data';
import { Image } from '../Image';
import { COLUMN, P, ROW } from '../Typography';
import * as css from './Tile.module.scss';

const WIDTH = 16 * COLUMN;
const HEIGHT = 6 * ROW;
const MARGIN = 2 * COLUMN;

const PersonTile = ({ asset }: { asset?: PersonAsset }) => {
	const dataProvider = useDataProvider();

	return (
		<>
			<Image
				className={`${css.image}`}
				src={
					asset
						? dataProvider.getImageUrl(asset, ['profile'], {
								width: WIDTH,
							})
						: ''
				}
			/>
			<P className={css.title}>
				{asset?.title ?? '-'}
				<br />
				{asset?.role && asset.role.length ? asset.role : '-'}
			</P>
		</>
	);
};

const TileWithImage = ({ asset }: { asset?: Asset }) => {
	const dataProvider = useDataProvider();

	return (
		<>
			<Image
				className={`${css.image}`}
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
			<P className={css.title}>{asset?.title ?? '-'}</P>
		</>
	);
};

const TileWithoutImage = ({ asset }: { asset?: Asset }) => {
	return (
		<>
			<div className={css.colorbox}>
				<P>{asset?.title.toLowerCase() ?? '-'}</P>
			</div>
			<P className={css.title}>{asset?.title ?? '-'}</P>
		</>
	);
};

const getTile = (asset?: Asset) => {
	if (asset && (isGenre(asset) || isShowAll(asset))) {
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
	style?: ComponentProps<'div'>['style'];
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
			case 'show-all':
				navigate(`/discover/${btoa((asset as ShowAllAsset).data)}`);
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
		<Interactable
			className={`${css.wrap} ${css[asset?.type ?? ''] ?? ''}`}
			id={id}
			style={{ ...style, visibility: asset ? 'visible' : 'hidden' }}
			onPress={onPress}
			onFocus={onFocus}
		>
			{/* @ts-expect-error: asset mapping */}
			{<TileComponent asset={asset} />}
		</Interactable>
	);
};
Tile.width = WIDTH + MARGIN;
Tile.height = HEIGHT;
