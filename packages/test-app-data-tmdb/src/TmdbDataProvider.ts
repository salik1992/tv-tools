import { DataProvider } from '@salik1992/test-app-data/DataProvider';
import type {
	Asset,
	AssetImages,
	AssetMapping,
	AssetType,
	BrowseItem,
	GenreAsset,
	Id,
	ImageSize,
	ImageType,
	Paged,
} from '@salik1992/test-app-data/types';
import { BASE_URL, BROWSE, GENERIC_TYPE_TO_TMDB_TYPE, MENU } from './constants';
import {
	mapBaseMovieAsset,
	mapConfiguration,
	mapGenre,
	mapMovieAsset,
	mapPage,
	mapTvAsset,
} from './mapping';
import type {
	Configuration,
	ConfigurationResponse,
	TmdbAssetMapping,
	TmdbBaseMovieAsset,
	TmdbBaseTvAsset,
	TmdbConfiguration,
	TmdbGenres,
	TmdbMovieAsset,
	TmdbPagedResults,
	TrendingTimeWindow,
} from './types';

export class TmdbDataProvider extends DataProvider<TmdbConfiguration> {
	private configuration: Configuration | undefined;

	constructor(private tmdbAccessToken: string) {
		super();
	}

	public override async initialize() {
		const configurationResponse =
			await this.fetch<ConfigurationResponse>('configuration');
		this.configuration = mapConfiguration(configurationResponse);
	}

	public override getImageUrl(
		asset: AssetImages,
		types: (keyof AssetImages['images'])[],
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
			if (!imagePath) {
				continue;
			}
			return `${this.configuration.images.base}${size.id}${imagePath}`;
		}
		return null;
	}

	public override async getMenu() {
		return MENU;
	}

	public override async getBrowse(id: Id) {
		return (
			(
				BROWSE as unknown as Record<
					string,
					BrowseItem<TmdbConfiguration['filter']>[]
				>
			)[id] ?? []
		);
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
			case 'genres':
				return this.getGenres(filter.type);
			default:
				return { pages: 0 };
		}
	}

	public override async getAsset(
		type: AssetType,
		id: Id,
	): Promise<AssetMapping[typeof type]> {
		const response = await this.fetch<TmdbAssetMapping[typeof type]>(
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
	): Promise<Paged<AssetMapping[typeof type]>> {
		const pagedResponse = await this.fetch<
			TmdbPagedResults<TmdbAssetMapping[typeof type]>
		>(`discover/${GENERIC_TYPE_TO_TMDB_TYPE[type]}?page=${page + 1}`);
		return type === 'movie'
			? mapPage<TmdbAssetMapping[typeof type], AssetMapping[typeof type]>(
					page,
					mapBaseMovieAsset,
				)(pagedResponse as TmdbPagedResults<TmdbBaseMovieAsset>)
			: mapPage<TmdbAssetMapping[typeof type], AssetMapping[typeof type]>(
					page,
					mapTvAsset,
				)(pagedResponse as TmdbPagedResults<TmdbBaseTvAsset>);
	}

	private async getTrending(
		type: 'movie' | 'series',
		timeWindow: TrendingTimeWindow = 'day',
	): Promise<Paged<AssetMapping[typeof type]>> {
		const pagedResponse = await this.fetch<
			TmdbPagedResults<TmdbAssetMapping[typeof type]>
		>(`trending/${GENERIC_TYPE_TO_TMDB_TYPE[type]}/${timeWindow}`);
		return type === 'movie'
			? mapPage<TmdbAssetMapping[typeof type], AssetMapping[typeof type]>(
					0,
					mapBaseMovieAsset,
				)(pagedResponse as TmdbPagedResults<TmdbBaseMovieAsset>)
			: mapPage<TmdbAssetMapping[typeof type], AssetMapping[typeof type]>(
					0,
					mapTvAsset,
				)(pagedResponse as TmdbPagedResults<TmdbBaseTvAsset>);
	}

	private async getGenres(
		type: 'movie' | 'series',
	): Promise<Paged<GenreAsset>> {
		const response = await this.fetch<TmdbGenres>(
			`genre/${GENERIC_TYPE_TO_TMDB_TYPE[type]}/list`,
		);
		return {
			pages: 1,
			[0]: response.genres.map(mapGenre),
		};
	}

	private async fetch<T>(url: string) {
		const response = await fetch(`${BASE_URL}/${url}`, {
			headers: { Authorization: `Bearer ${this.tmdbAccessToken}` },
		});
		const data = await response.json();
		return data as T;
	}
}
