import { ASSET_TYPES } from './constants';
import type {
	Asset,
	AssetType,
	EpisodeAsset,
	Id,
	MovieAsset,
	PersonAsset,
	SeasonAsset,
	SeriesAsset,
} from './types';

export function validateMovie(asset: Asset) {
	if (asset.type !== 'movie') {
		throw new Error('Asset is not a movie.');
	}
	return asset as MovieAsset;
}

export function validateSeries(asset: Asset) {
	if (asset.type !== 'series') {
		throw new Error('Asset is not a series.');
	}
	return asset as SeriesAsset;
}

export function validateSeason(asset: Asset) {
	if (asset.type !== 'season') {
		throw new Error('Asset is not a season.');
	}
	return asset as SeasonAsset;
}

export function validateEpisode(asset: Asset) {
	if (asset.type !== 'episode') {
		throw new Error('Asset is not an episode.');
	}
	return asset as EpisodeAsset;
}

export function validatePerson(asset: Asset) {
	if (asset.type !== 'person') {
		throw new Error('Asset is not a person.');
	}
	return asset as PersonAsset;
}

export function validateId(id: unknown) {
	if (typeof id !== 'string') {
		throw new Error(`"${id}" is not a valid id.`);
	}
	return id as Id;
}

export function validateAssetType(type: unknown) {
	if (
		typeof type !== 'string' ||
		!ASSET_TYPES.includes(type as (typeof ASSET_TYPES)[number])
	) {
		throw new Error(`Asset type "${type}" is not a valid asset type.`);
	}
	return type as AssetType;
}
