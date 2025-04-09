import { toKeys } from '@salik1992/tv-tools/utils/toKeys';
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
	PersonAsset,
} from '@salik1992/test-app-data/types';
import { BASE_URL, BROWSE, GENERIC_TYPE_TO_TMDB_TYPE, MENU } from './constants';
import {
	mapConfiguration,
	mapFullAssetByType,
	mapGenre,
	mapPageByAssetType,
} from './mapping';
import type {
	Configuration,
	ConfigurationResponse,
	TmdbAssetMapping,
	TmdbConfiguration,
	TmdbConfigurationFilters,
	TmdbCreditsResults,
	TmdbGenres,
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
		types: ImageType[],
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
		filter: TmdbConfigurationFilters,
		page = 0,
	): Promise<Paged<Asset>> {
		switch (filter.filterBy) {
			case 'discover':
				return this.getDiscover(filter.type, { page: page + 1 });
			case 'trending':
				return this.getTrending(filter.type, filter.timeWindow);
			case 'genres':
				return this.getGenres(filter.type);
			case 'genre':
				return this.getDiscover(filter.type, {
					page: page + 1,
					with_genres: filter.id,
				});
			case 'search':
				return this.getSearch(filter.type, {
					page: page + 1,
					query: filter.query,
				});
			case 'castAndCrew':
				return this.getCredits(filter.type, filter.id);
			case 'related':
				return this.getSimilar(filter.type, filter.id, {
					page: page + 1,
				});
			case 'knownFor':
				return this.getPersonCredits(filter.type, filter.id);
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
		return mapFullAssetByType(type, response);
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

	private filterToQueryParams(
		filter: Record<string, string | number | boolean | undefined>,
	) {
		return toKeys(filter)
			.map((key) =>
				typeof filter[key] !== 'undefined'
					? `${key}=${encodeURIComponent(filter[key])}`
					: null,
			)
			.filter((s) => s !== null)
			.join('&');
	}

	private async getDiscover(
		type: 'movie' | 'series',
		filter: {
			page: number;
			with_genres?: Id;
		},
	): Promise<Paged<AssetMapping[typeof type]>> {
		const filterQueryParams = this.filterToQueryParams(filter);
		const pagedResponse = await this.fetch<
			TmdbPagedResults<TmdbAssetMapping[typeof type]>
		>(`discover/${GENERIC_TYPE_TO_TMDB_TYPE[type]}?${filterQueryParams}`);
		return mapPageByAssetType(filter.page - 1, type)(pagedResponse);
	}

	private async getTrending(
		type: 'movie' | 'series',
		timeWindow: TrendingTimeWindow = 'day',
	): Promise<Paged<AssetMapping[typeof type]>> {
		const pagedResponse = await this.fetch<
			TmdbPagedResults<TmdbAssetMapping[typeof type]>
		>(`trending/${GENERIC_TYPE_TO_TMDB_TYPE[type]}/${timeWindow}`);
		return mapPageByAssetType(0, type)(pagedResponse);
	}

	private async getGenres(
		type: 'movie' | 'series',
	): Promise<Paged<GenreAsset>> {
		const response = await this.fetch<TmdbGenres>(
			`genre/${GENERIC_TYPE_TO_TMDB_TYPE[type]}/list`,
		);
		return {
			pages: 1,
			[0]: response.genres.map(mapGenre(type)),
		};
	}

	private async getSearch(
		type: 'movie' | 'series' | 'person',
		filter: { page: number; query: string },
	) {
		const filterQueryParams = this.filterToQueryParams(filter);
		const pagedResponse = await this.fetch<
			TmdbPagedResults<TmdbAssetMapping[typeof type]>
		>(`search/${GENERIC_TYPE_TO_TMDB_TYPE[type]}?${filterQueryParams}`);
		return mapPageByAssetType(filter.page - 1, type)(pagedResponse);
	}

	private async getCredits(
		type: 'movie' | 'series',
		id: Id,
	): Promise<Paged<PersonAsset>> {
		const response = await this.fetch<TmdbCreditsResults>(
			`${GENERIC_TYPE_TO_TMDB_TYPE[type]}/${id}/credits`,
		);
		return mapPageByAssetType(
			0,
			'person',
		)({
			page: 1,
			results: [...response.cast, ...response.crew],
			total_pages: 1,
			total_results: response.cast.length + response.crew.length,
		});
	}

	private async getPersonCredits(type: 'movie' | 'series', id: Id) {
		const response = await this.fetch<TmdbCreditsResults>(
			`${GENERIC_TYPE_TO_TMDB_TYPE['person']}/${id}/${GENERIC_TYPE_TO_TMDB_TYPE[type]}_credits`,
		);
		return mapPageByAssetType(
			0,
			type,
		)({
			page: 1,
			results: [...response.cast, ...response.crew],
			total_pages: 1,
			total_results: response.cast.length + response.crew.length,
		});
	}

	private async getSimilar(
		type: 'movie' | 'series',
		id: Id,
		filter: { page: number },
	) {
		const filterQueryParams = this.filterToQueryParams(filter);
		const pagedResponse = await this.fetch<
			TmdbPagedResults<TmdbAssetMapping[typeof type]>
		>(
			`${GENERIC_TYPE_TO_TMDB_TYPE[type]}/${id}/similar?${filterQueryParams}`,
		);
		return mapPageByAssetType(filter.page - 1, type)(pagedResponse);
	}

	private async fetch<T>(url: string) {
		const response = await fetch(`${BASE_URL}/${url}`, {
			headers: { Authorization: `Bearer ${this.tmdbAccessToken}` },
		});
		const data = await response.json();
		return data as T;
	}
}
