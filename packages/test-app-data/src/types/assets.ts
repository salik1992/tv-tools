import { ImageType } from './images';

export type Id = string;

export type AssetType =
	| 'movie'
	| 'series'
	| 'season'
	| 'episode'
	| 'person'
	| 'genre';

export type Country = {
	iso_3166_1: string;
	title: string;
};

export type Language = {
	englishTitle: string;
	iso_639_1: string;
	title: string;
};

export type ProductionCompany = {
	logo: string;
	title: string;
	country: string;
};

export type Asset = {
	type: AssetType;
	id: Id;
	title: string;
	relatedAssetType?: AssetType;
};

export type AssetDescription = {
	description: string;
};

export type AssetRating = {
	rating?: {
		value: number;
		unit: string;
		votes?: number;
	};
};

export type AssetImages = {
	images: Partial<Record<ImageType, string>>;
};

export type AssetOriginal = {
	original: {
		language: string;
		title: string;
	};
};

export type MovieAsset = Asset &
	AssetDescription &
	AssetImages &
	AssetOriginal &
	AssetRating & {
		type: 'movie';
		genres: GenreAsset[];
		adult: boolean;
		releaseDate: string;
		hasVideo: boolean;
		collection?: Id;
		budget?: number;
		productionCompanies?: ProductionCompany[];
		countries?: Country[];
		revenue?: number;
		runtime?: number;
		languages?: Language[];
	};

export type SeriesAsset = Asset &
	AssetDescription &
	AssetImages &
	AssetOriginal &
	AssetRating & {
		type: 'series';
		genres: GenreAsset[];
		releaseDate: string;
		seasons: Id[];
	};

export type SeasonAsset = Asset &
	AssetDescription &
	AssetImages &
	AssetOriginal &
	AssetRating & {
		type: 'season';
		episodes: Id[];
	};

export type EpisodeAsset = Asset &
	AssetDescription &
	AssetImages &
	AssetOriginal &
	AssetRating & {
		type: 'episode';
		genres: GenreAsset[];
		adult: boolean;
		releaseDate: string;
		hasVideo: boolean;
	};

export type PersonAsset = Asset &
	Partial<AssetDescription> &
	AssetImages &
	AssetOriginal & {
		type: 'person';
		birth?: Date;
		death?: Date;
		origin?: string;
		profession?: string;
		knownFor: {
			type: AssetType;
			id: Id;
			title: string;
			role?: string;
		}[];
	};

export type GenreAsset = Asset & {
	type: 'genre';
};

export type AssetMapping = {
	movie: MovieAsset;
	series: SeriesAsset;
	season: SeasonAsset;
	episode: EpisodeAsset;
	person: PersonAsset;
	genre: GenreAsset;
};

export type Paged<T> = {
	[page: number]: T[];
	pages: number;
};
