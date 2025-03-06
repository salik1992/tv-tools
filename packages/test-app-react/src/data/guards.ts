import type {
	Asset,
	EpisodeAsset,
	MovieAsset,
	PersonAsset,
	SeasonAsset,
	SeriesAsset,
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
