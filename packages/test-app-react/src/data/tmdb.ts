import {
	mapBaseMovieAsset,
	mapMovieAsset,
	mapPage,
	mapTvAsset,
} from './tmdbMapping';
import type {
	DiscoverMapping,
	DiscoverTypes,
	TmdbBaseMovieAsset,
	TmdbBaseTvAsset,
	TmdbMovieAsset,
	TmdbPagedResults,
	TrendingTimeWindow,
	TrendingTypes,
} from './tmdbTypes';
import type { Asset, Id, Paged, AssetMapping, AssetType } from './types';

const GENERIC_TYPE_TO_TMDB_TYPE = {
	movie: 'movie',
	series: 'tv',
	season: 'season',
	episode: 'episode',
	person: 'people',
} as const;
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
		type: 'movie' | 'series',
		page = 1,
	): Promise<Paged<Asset>> {
		const pagedResponse = await this.fetch<
			TmdbPagedResults<DiscoverMapping[typeof type]>
		>(`discover/${GENERIC_TYPE_TO_TMDB_TYPE[type]}?page=${page}`);
		return type === 'movie'
			? mapPage<DiscoverMapping[typeof type]>(
					page,
					mapBaseMovieAsset,
				)(pagedResponse as TmdbPagedResults<TmdbBaseMovieAsset>)
			: mapPage<DiscoverMapping[typeof type]>(
					page,
					mapTvAsset,
				)(pagedResponse as TmdbPagedResults<TmdbBaseTvAsset>);
	}

	public async getTrending(
		type: 'movie' | 'series',
		timeWindow: TrendingTimeWindow = 'day',
	): Promise<Paged<Asset>> {
		const pagedResponse = await this.fetch<
			TmdbPagedResults<DiscoverMapping[typeof type]>
		>(`trending/${GENERIC_TYPE_TO_TMDB_TYPE[type]}/${timeWindow}`);
		return type === 'movie'
			? mapPage<DiscoverMapping[typeof type]>(
					1,
					mapBaseMovieAsset,
				)(pagedResponse as TmdbPagedResults<TmdbBaseMovieAsset>)
			: mapPage<DiscoverMapping[typeof type]>(
					1,
					mapTvAsset,
				)(pagedResponse as TmdbPagedResults<TmdbBaseTvAsset>);
	}

	public async getDetail(
		type: DiscoverTypes,
		id: Id,
	): Promise<AssetMapping[typeof type]> {
		const response = await this.fetch<DiscoverMapping[typeof type]>(
			`${GENERIC_TYPE_TO_TMDB_TYPE[type]}/${id}`,
		);
		return type === 'movie'
			? mapMovieAsset(response as TmdbMovieAsset)
			: mapTvAsset(response as TmdbBaseTvAsset);
	}

	private async fetch<T>(url: string) {
		const response = await fetch(`${BASE_URL}/${url}`, {
			headers: { Authorization: `Bearer ${this.tmdbAccessToken}` },
		});
		const data = await response.json();
		return data as T;
	}
}
