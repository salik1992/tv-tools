import { mapMovieAsset, mapPage, mapTvAsset } from './tmdbMapping';
import type {
	DiscoverMapping,
	DiscoverTypes,
	TmdbBaseMovieAsset,
	TmdbBaseTvAsset,
	TmdbPagedResults,
	TrendingTimeWindow,
	TrendingTypes,
} from './tmdbTypes';
import type { Asset, Paged } from './types';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';
const IMAGE_SIZES = {
	backdrop: [300, 780, 1280] as const,
	poster: [92, 154, 185, 342, 500, 780] as const,
} as const;

export class TmdbApi {
	constructor(private tmdbAccessToken: string) {}

	public getImage(asset: Asset, type: keyof Asset['images'], width: number) {
		const size = IMAGE_SIZES[type].find((w) => w > width);
		const sizeString = typeof size === 'number' ? `w${size}` : 'original';
		return `${IMAGE_BASE}/${sizeString}${asset.images[type]}`;
	}

	public async getDiscover(
		type: DiscoverTypes,
		page = 1,
	): Promise<Paged<Asset>> {
		const pagedResponse = await this.fetch<
			TmdbPagedResults<DiscoverMapping[typeof type]>
		>(`discover/${type}?page=${page}`);
		return type === 'movie'
			? mapPage<DiscoverMapping[typeof type]>(
					page,
					mapMovieAsset,
				)(pagedResponse as TmdbPagedResults<TmdbBaseMovieAsset>)
			: mapPage<DiscoverMapping[typeof type]>(
					page,
					mapTvAsset,
				)(pagedResponse as TmdbPagedResults<TmdbBaseTvAsset>);
	}

	public async getTrending(
		type: TrendingTypes,
		timeWindow: TrendingTimeWindow = 'day',
	): Promise<Paged<Asset>> {
		const pagedResponse = await this.fetch<
			TmdbPagedResults<DiscoverMapping[typeof type]>
		>(`trending/${type}/${timeWindow}`);
		return type === 'movie'
			? mapPage<DiscoverMapping[typeof type]>(
					1,
					mapMovieAsset,
				)(pagedResponse as TmdbPagedResults<TmdbBaseMovieAsset>)
			: mapPage<DiscoverMapping[typeof type]>(
					1,
					mapTvAsset,
				)(pagedResponse as TmdbPagedResults<TmdbBaseTvAsset>);
	}

	private async fetch<T>(url: string) {
		const response = await fetch(`${BASE_URL}/${url}`, {
			headers: { Authorization: `Bearer ${this.tmdbAccessToken}` },
		});
		const data = await response.json();
		return data as T;
	}
}
