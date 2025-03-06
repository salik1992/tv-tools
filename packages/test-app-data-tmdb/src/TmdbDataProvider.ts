import type {
	Asset,
	Id,
	Paged,
	AssetMapping,
	ImageSize,
	ImageType,
	AssetType,
} from '@salik1992/test-app-data/types';
import { DataProvider } from '@salik1992/test-app-data/DataProvider';
import {
	mapBaseMovieAsset,
	mapConfiguration,
	mapMovieAsset,
	mapPage,
	mapTvAsset,
} from './mapping';
import type {
	Configuration,
	ConfigurationResponse,
	DiscoverMapping,
	TmdbBaseMovieAsset,
	TmdbBaseTvAsset,
	TmdbConfiguration,
	TmdbMovieAsset,
	TmdbPagedResults,
	TrendingTimeWindow,
} from './types';
import { BASE_URL, GENERIC_TYPE_TO_TMDB_TYPE } from './constants';

export class TmdbDataProvider extends DataProvider<TmdbConfiguration> {
	private configuration: Configuration | undefined;

	constructor(private tmdbAccessToken: string) {
		super();
		this.initialize();
	}

	public override getImageUrl(
		asset: Asset,
		types: (keyof Asset['images'])[],
		imageSize: ImageSize,
	) {
		if (!this.configuration) {
			return null;
		}
		const availableTypes = types.filter(
			(type) => asset.images[type] !== undefined,
		);
		for (const type of availableTypes) {
			const size = this.getImageSizeForType(type, imageSize);
			if (!size) {
				continue;
			}
			const imagePath = asset.images[type];
			return `${this.configuration.images.base}${size.id}${imagePath}`;
		}
		return null;
	}

	public override async getPagedAssets(
		filter: TmdbConfiguration['filter'],
		page = 0,
	): Promise<Paged<Asset>> {
		switch (filter.filterBy) {
			case 'discover':
				return this.getDiscover(filter.type, page);
			case 'trending':
				return this.getTrending(filter.type, filter.timeWindow);
			default:
				return { pages: 0 };
		}
	}

	public override async getAsset(
		type: AssetType,
		id: Id,
	): Promise<AssetMapping[typeof type]> {
		const response = await this.fetch<DiscoverMapping[typeof type]>(
			`${GENERIC_TYPE_TO_TMDB_TYPE[type]}/${id}`,
		);
		return type === 'movie'
			? mapMovieAsset(response as unknown as TmdbMovieAsset)
			: mapTvAsset(response as TmdbBaseTvAsset);
	}

	private getImageSizeForType(type: ImageType, { width, height }: ImageSize) {
		if (!this.configuration) {
			return;
		}
		const sizes = this.configuration.images.sizes[type];
		return sizes.find(
			(s) =>
				(typeof s.width === 'number' &&
					typeof width === 'number' &&
					s.width > width) ||
				(typeof s.height === 'number' &&
					typeof height === 'number' &&
					s.height > height) ||
				s.id === 'original',
		);
	}

	private async getDiscover(
		type: 'movie' | 'series',
		page: number,
	): Promise<Paged<Asset>> {
		const pagedResponse = await this.fetch<
			TmdbPagedResults<DiscoverMapping[typeof type]>
		>(`discover/${GENERIC_TYPE_TO_TMDB_TYPE[type]}?page=${page + 1}`);
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

	private async getTrending(
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

	private async initialize() {
		const configurationResponse =
			await this.fetch<ConfigurationResponse>('configuration');
		this.configuration = mapConfiguration(configurationResponse);
	}

	private async fetch<T>(url: string) {
		const response = await fetch(`${BASE_URL}/${url}`, {
			headers: { Authorization: `Bearer ${this.tmdbAccessToken}` },
		});
		const data = await response.json();
		return data as T;
	}
}
