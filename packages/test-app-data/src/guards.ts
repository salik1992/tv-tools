import { ASSET_TYPES } from './constants';
import type {
	Asset,
	AssetType,
	EpisodeAsset,
	GenreAsset,
	Id,
	MovieAsset,
	PersonAsset,
	SeasonAsset,
	SeriesAsset,
	ShowAllAsset,
} from './types';

export function isMovie(asset: Asset): asset is MovieAsset {
	return asset.type === 'movie';
}

export function isSeries(asset: Asset): asset is SeriesAsset {
	return asset.type === 'series';
}

export function isSeason(asset: Asset): asset is SeasonAsset {
	return asset.type === 'season';
}

export function isEpisode(asset: Asset): asset is EpisodeAsset {
	return asset.type === 'episode';
}

export function isPerson(asset: Asset): asset is PersonAsset {
	return asset.type === 'person';
}

export function isGenre(asset: Asset): asset is GenreAsset {
	return asset.type === 'genre';
}

export function isShowAll(asset: Asset): asset is ShowAllAsset {
	return asset.type === 'show-all';
}

export function isId(id: unknown): id is Id {
	return typeof id === 'string';
}

export function isAssetType(type: unknown): type is AssetType {
	return typeof type === 'string' && type in ASSET_TYPES;
}
